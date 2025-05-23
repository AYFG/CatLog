import { removeData } from "@/utils/storage";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function LogoutModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    removeData("userData");
    queryClient.clear();
    router.dismissTo("/Login");
  };
  return (
    <Animated.View className="items-center justify-center flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View entering={SlideInDown} className="flex w-3/5 shadow-lg rounded-xl bg-snow ">
        <Text className="mt-5 mb-3 ml-5 font-bold">로그아웃</Text>
        <Text className="ml-5">정말 로그아웃할까요?</Text>
        <View className="flex flex-row items-center justify-center my-4">
          <Pressable
            onPress={() => router.back()}
            android_ripple={{ color: "#ddd" }}
            className="font-bold flex-1 ml-4 mr-2 py-4 rounded-lg bg-[#e9ecef]"
          >
            <Text className="font-bold text-center">취소</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            android_ripple={{ color: "#f5d4e0" }}
            className="items-center flex-1 py-4 mr-4 rounded-lg bg-wePeep"
          >
            <Text className="font-bold text-center text-snow">확인</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
