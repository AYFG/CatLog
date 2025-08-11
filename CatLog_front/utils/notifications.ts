import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export function setGlobalNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// local 건강검진 가는 날 알림
export async function healthCheckupNotificationHandler(day: Date, cycle: string, catName: string) {
  const medicationDate = new Date(day); // 예: "2025-05-15"
  const medicationCycleDays = parseInt(cycle); // 예: 40

  // 다음 건강검진 계산
  const nextMedicationDate = new Date(medicationDate);
  nextMedicationDate.setDate(medicationDate.getDate() + medicationCycleDays);

  // 전날 알림
  const dayBeforeNotification = new Date(nextMedicationDate);
  dayBeforeNotification.setDate(nextMedicationDate.getDate() - 1);
  dayBeforeNotification.setHours(17, 36, 0, 0); // 오후 5:00

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${catName}의 건강검진 알림`,
      body: `내일은 ${catName}의 건강검진 가는 날이에요.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dayBeforeNotification,
    },
  });

  // 당일 알림
  const onDayNotification = new Date(nextMedicationDate);
  onDayNotification.setHours(17, 36, 0, 0); // 오후 5:00

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${catName}의 건강검진 알림`,
      body: `오늘은 ${catName}의 건강검진 가는 날이에요.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: onDayNotification,
    },
  });

  // 확인용 로그
  console.log("사상충 알림 예약:");
  console.log("- 전날:", dayBeforeNotification.toString());
  console.log("- 당일:", onDayNotification.toString());
}
// local 심장사상충 약 알림
export async function heartwormNotificationHandler(day: Date, cycle: string, catName: string) {
  const medicationDate = new Date(day); // 예: "2025-05-15"
  const medicationCycleDays = parseInt(cycle); // 예: 40

  // 다음 복용일 계산
  const nextMedicationDate = new Date(medicationDate);
  nextMedicationDate.setDate(medicationDate.getDate() + medicationCycleDays);

  // 전날 알림
  const dayBeforeNotification = new Date(nextMedicationDate);
  dayBeforeNotification.setDate(nextMedicationDate.getDate() - 1);
  dayBeforeNotification.setHours(17, 36, 0, 0); // 오후 5:00

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${catName}의 심장사상충 약 알림`,
      body: `내일은 ${catName}의 심장사상충 약 투여하는 날이에요.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dayBeforeNotification,
    },
  });

  // 당일 알림
  const onDayNotification = new Date(nextMedicationDate);
  onDayNotification.setHours(17, 36, 0, 0); // 오후 5:00

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${catName}의 심장사상충 약 알림`,
      body: `오늘은 ${catName}의 심장사상충 약 투여하는 날이에요.`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: onDayNotification,
    },
  });

  // 확인용 로그
  console.log("사상충 알림 예약:");
  console.log("- 전날:", dayBeforeNotification.toString());
  console.log("- 당일:", onDayNotification.toString());
}

// local 사냥 종료 알림
export async function huntNotificationHandler(seconds: number) {
  const now = Date.now();
  const alarm = new Date(now + seconds * 1000);

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
    // console.error("푸시 알림 토큰 요청 실패:", error);
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
