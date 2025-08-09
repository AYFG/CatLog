import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function BackButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      android_ripple={{ color: "lightgray", borderless: true }}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </Pressable>
  );
}
