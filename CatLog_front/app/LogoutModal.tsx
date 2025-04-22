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

      <Animated.View
        entering={SlideInDown}
        className="flex w-3/5 shadow-lg rounded-xl bg-snow h-1/6"
      >
        <Text className="mt-5 mb-3 ml-5 font-bold">로그아웃</Text>
        <Text className="ml-5">정말 로그아웃할까요?</Text>
        <View className="flex flex-row items-center justify-center flex-1 gap-2 p-4">
          <View className="items-center flex-1 p-4 font-bold rounded-lg  bg-[#e9ecef]">
            <Pressable onPress={() => router.back()}>
              <Text className="font-bold">취소</Text>
            </Pressable>
          </View>
          <View className="items-center flex-1 p-4 rounded-lg bg-wePeep">
            <Pressable onPress={handleLogout}>
              <Text className="font-bold text-snow">확인</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
