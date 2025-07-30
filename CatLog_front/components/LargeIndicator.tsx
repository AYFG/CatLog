import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function LargeIndicator() {
  return (
    <View className="items-center justify-center flex-1">
      <ActivityIndicator size="large" color="#dbc0e7" />
    </View>
  );
}
