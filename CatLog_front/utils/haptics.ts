import * as Haptics from "expo-haptics";

export const successHaptics = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
export const mediumHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};
export const lightHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
