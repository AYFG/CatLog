import "@/global.css";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import * as Updates from "expo-updates";
import * as Notifications from "expo-notifications";
import { UserData } from "@/types/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
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

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("알림 권한이 필요합니다.");
      }
    })();
  }, []);

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(`${error}`);
    }
  }
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("NOTIFICATION RECEIVED");
      console.log(notification);
      const userName = notification.request.content.data.userName;
      console.log(userName);
    });
    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("NOTIFICATION RESPONSE RECEIVED");
      console.log(response);
      const userName = response.notification.request.content.data.userName;
      console.log(userName);
    });
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserData = await getData("userData");
      if (storedUserData == null) {
        router.replace("/Login");
      } else {
        setUserData(storedUserData);
        setNotLogin(false);
      }
    };
    fetchData();
    onFetchUpdateAsync();
  }, []);

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
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#dbc0e7" />
      </View>
    );
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

  const huntingStart = () => {
    if (timerStart) {
      setTimerStart(false);
      setRiveState("BasicMovement");
      setHuntingTime(ownerPickTime ? ownerPickTime : 60 * 20);
    } else {
      setTimerStart(true);
      setRiveState("HuntingMovement");
    }
  };

  function notificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "test local notification",
        body: "This is the body of the notification.",
        data: { userName: "Max" },
      },
      trigger: {
        seconds: 2,
      },
    });
  }
  return (
    <SafeAreaView className="flex-1 bg-snow">
      <ScrollView className="flex">
        <View className="items-center justify-center">
          <View className="mt-6 w-[350] h-[350] bg-jaggedIce rounded-full">
            {/* <Rive
              resourceName="whitecat"
              artboardName="WhiteCat 2"
              stateMachineName={riveState}
              autoplay={true}
              style={{}}
            /> */}
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
                Vibration.vibrate([500, 1000, 500, 1000]);
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
            <SubmitButton children="test" handleSubmit={notificationHandler}></SubmitButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
