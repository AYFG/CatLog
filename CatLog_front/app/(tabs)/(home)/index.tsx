import SubmitButton from "@/components/SubmitButton";
import "@/global.css";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { TimerPickerModal } from "react-native-timer-picker";
import ReLogin from "../../ReLogin";

import LargeIndicator from "@/components/LargeIndicator";
import RiveCatAnimation from "@/components/RiveCatAnimation";
import { UserData } from "@/types/auth";
import { onFetchUpdateAsync } from "@/utils/easUpdate";
import {
  getExpoPushToken,
  huntNotificationHandler,
  setGlobalNotificationHandler,
} from "@/utils/notifications";
import { clearTimerEndTime, loadRemainingTime, saveTimerEndTime } from "@/utils/timer";
import * as Notifications from "expo-notifications";
import { Entypo } from "@expo/vector-icons";

export default function App() {
  const router = useRouter();
  const [notLogin, setNotLogin] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats, setCats } = useCatStore();
  const [timerStart, setTimerStart] = useState(false);
  const [timeComplete, setTimeComplete] = useState(false);
  const [movementState, setMovementState] = useState("BasicMovement");
  const [timerPickerModalOpen, setTimerPickerModalOpen] = useState(false);
  const [huntingTime, setHuntingTime] = useState(60 * 20);
  const [ownerPickTime, setOwnerPickTime] = useState<number | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  useEffect(() => {
    const initApp = async () => {
      // 로그인 확인
      const storedUserData = await getData("userData");
      if (!storedUserData) {
        router.replace("/Login");
        return;
      }
      setUserData(storedUserData);
      setNotLogin(false);

      // 알림 토큰 받기
      const token = await getExpoPushToken();
      if (token) {
        setPushToken(token);
        console.log("Push Token:", token);
      }

      // EAS 업데이트 확인
      onFetchUpdateAsync();
    };

    // 타이머 동기화
    const restoreTimer = async () => {
      const remaining = await loadRemainingTime();
      if (remaining) {
        setTimerStart(true);
        setMovementState("HuntingMovement");
        setHuntingTime(remaining);
      }
    };

    restoreTimer();
    initApp();
    setGlobalNotificationHandler();
  }, []);

  // useEffect(() => {
  //   const checkScheduledNotifications = async () => {
  //     // 예약된 알림들을 가져옵니다.
  //     const newScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  //     // 콘솔에 예약된 알림들을 출력합니다.
  //     console.log("Scheduled notifications:", newScheduledNotifications);
  //   };
  //   checkScheduledNotifications();
  // }, [scheduledNotifications]);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["cats"],
    queryFn: () =>
      apiRequest(`cat/${userData?.userId}`, "GET", undefined, userData?.accessToken || ""),
    enabled: userData !== null,
  });
  useEffect(() => {
    if (isSuccess && data) {
      setCats(data.cats);
    }
  }, [data]);

  if (isLoading) {
    return <LargeIndicator />;
  }

  if (isError) {
    console.log("에러");
    console.log(isError);
    return <ReLogin />;
  }
  if (notLogin) {
    console.log("notLogin");
    return <ReLogin />;
  }
  console.log(cats);
  const huntingStart = async () => {
    if (timerStart) {
      setTimerStart(false);
      setMovementState("BasicMovement");
      setHuntingTime(ownerPickTime ? ownerPickTime : 60 * 20);
      Notifications.cancelAllScheduledNotificationsAsync();
      await clearTimerEndTime();
    } else {
      setTimerStart(true);
      setMovementState("HuntingMovement");
      const now = Date.now();
      const end = now + huntingTime * 1000;
      await saveTimerEndTime(end);
      huntNotificationHandler(huntingTime);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <ScrollView className="flex">
        <View className="items-center justify-center">
          <View className="items-center w-full pt-16 pb-4">
            <Pressable
              onPress={() => router.push("/SelectCatColor")}
              android_ripple={{ color: "lightgray", radius: 25 }}
              className="absolute top-0 right-0"
            >
              <Entypo name={"cycle"} size={32} color="black" className="p-4" />
            </Pressable>
            <RiveCatAnimation movementState={movementState} />
          </View>

          <View className="mt-12">
            <CountdownCircleTimer
              key={huntingTime}
              isPlaying={timerStart}
              duration={huntingTime}
              strokeWidth={6}
              colors={["#EF798A", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[huntingTime / 2, huntingTime / 3, huntingTime / 4, huntingTime / 5]}
              onComplete={() => {
                setTimeComplete(true);
                setTimerStart(false);
                setMovementState("BasicMovement");
                setHuntingTime(60 * 20);
                clearTimerEndTime();
              }}
            >
              {({ remainingTime }) => {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                const displayMinutes = String(minutes).padStart(2, "0");
                const displaySeconds = String(seconds).padStart(2, "0");
                return (
                  <Pressable
                    onPress={() => {
                      setTimerPickerModalOpen(true);
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>
                      {displayMinutes}:{displaySeconds}
                    </Text>
                  </Pressable>
                );
              }}
            </CountdownCircleTimer>
          </View>

          <View className=" bg-wePeep">
            {timerPickerModalOpen && (
              <TimerPickerModal
                hideHours
                hideSeconds
                minuteLabel="분"
                cancelButtonText="취소"
                confirmButtonText="설정"
                visible={timerPickerModalOpen}
                setIsVisible={setTimerPickerModalOpen}
                onConfirm={(pickedDuration) => {
                  const convertMinute = 60 * pickedDuration.minutes;
                  setHuntingTime(convertMinute);
                  setOwnerPickTime(convertMinute);
                  setTimerPickerModalOpen(false);
                }}
                onCancel={() => setTimerPickerModalOpen(false)}
                closeOnOverlayPress
                LinearGradient={LinearGradient}
                Haptics={Haptics}
                styles={{
                  theme: "light",
                  confirmButton: {
                    borderColor: "#f2c4d6",
                    backgroundColor: "#f2c4d6",
                    color: "#ffffff",
                  },
                }}
                modalProps={{
                  overlayOpacity: 0.2,
                }}
              />
            )}
          </View>
          <View className="">
            <SubmitButton
              children={
                timerStart ? (
                  <Text className="text-xl font-semibold color-[#EF798A] ">사냥 놀이 중지</Text>
                ) : (
                  <Text className="text-xl font-semibold">사냥 놀이 시작하기</Text>
                )
              }
              handleSubmit={huntingStart}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
