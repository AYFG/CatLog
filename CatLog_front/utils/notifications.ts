import * as Notifications from "expo-notifications";

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
export function notificationHandler() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "사냥놀이 종료",
      body: "설정한 사냥놀이 시간이 종료되었습니다.",
      data: { userName: "Max" },
    },
    trigger: {
      //   seconds: 1,
      type: "timeInterval",
    } as Notifications.TimeIntervalTriggerInput,
  });
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
