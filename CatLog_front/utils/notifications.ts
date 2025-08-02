import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import { SchedulableTriggerInputTypes } from "expo-notifications"; // Add this import

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

// local 알림
export async function notificationHandler(seconds: number) {
  const now = Date.now();
  const alarm = new Date(now + seconds * 1000);

  console.log(alarm);
  Notifications.scheduleNotificationAsync({
    content: {
      title: "사냥놀이 종료",
      body: "설정한 사냥놀이 시간이 종료되었습니다.",
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: alarm,
    },
    // trigger: {
    //   seconds: seconds,
    //   type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    // } as Notifications.TimeIntervalTriggerInput,
  });
}

// 푸시 알림 권한

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("푸시 알림 권한이 없습니다", "알림을 받으시려면 알림 허용을 해주세요.");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const pushTokenData = await Notifications.getExpoPushTokenAsync();
    return pushTokenData.data;
  } catch (error) {
    console.error("푸시 알림 토큰 요청 실패:", error);
    return null;
  }
}

//  push 알림 보내기
export function sendPushNotificationHandler({ pushToken }: { pushToken: string }) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: pushToken,
      title: "Test - sent from a device.",
      body: "push notification test",
    }),
  });
}
