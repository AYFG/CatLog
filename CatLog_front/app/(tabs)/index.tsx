import "@/global.css";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData, setData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  Vibration,
  View,
} from "react-native";
import Rive from "rive-react-native";
import ReLogin from "../ReLogin";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import SubmitButton from "@/components/SubmitButton";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import * as Notifications from "expo-notifications";
import { UserData } from "@/types/auth";
import { getExpoPushToken, huntNotificationHandler } from "@/utils/notifications";
import { onFetchUpdateAsync } from "@/utils/easUpdate";
import LargeIndicator from "@/components/LargeIndicator";
import RiveCatAnimation from "@/components/RiveCatAnimation";
import { clearTimerEndTime, loadRemainingTime, saveTimerEndTime } from "@/utils/timer";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export default function App() {
  const router = useRouter();
  const [notLogin, setNotLogin] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats, setCats } = useCatStore();
  const [timerStart, setTimerStart] = useState(false);
  const [timeComplete, setTimeComplete] = useState(false);
  const [riveState, setRiveState] = useState("BasicMovement");
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
        setRiveState("HuntingMovement");
        setHuntingTime(remaining);
      }
    };

    restoreTimer();
    initApp();
  }, []);
  useEffect(() => {
    const checkScheduledNotifications = async () => {
      // 예약된 알림들을 가져옵니다.
      const newScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      // 콘솔에 예약된 알림들을 출력합니다.
      console.log("Scheduled notifications:", newScheduledNotifications);
    };
    checkScheduledNotifications();
  }, [scheduledNotifications]);

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

  const huntingStart = async () => {
    if (timerStart) {
      setTimerStart(false);
      setRiveState("BasicMovement");
      setHuntingTime(ownerPickTime ? ownerPickTime : 60 * 20);
      Notifications.cancelAllScheduledNotificationsAsync();
      await clearTimerEndTime();
    } else {
      setTimerStart(true);
      setRiveState("HuntingMovement");
      const now = Date.now();
      const end = now + huntingTime * 1000;
      console.log(huntingTime);
      await saveTimerEndTime(end);
      huntNotificationHandler(huntingTime);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <ScrollView className="flex">
        <View className="items-center justify-center">
          <View className="mt-6 w-[350] h-[350] bg-jaggedIce rounded-full">
            <RiveCatAnimation riveState={riveState} />
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
                setRiveState("BasicMovement");
                setHuntingTime(60 * 20);
                clearTimerEndTime();
                // Vibration.vibrate([500, 1000, 500, 1000]);
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
          <View className="p-8">
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
