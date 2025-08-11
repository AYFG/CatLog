import React from "react";

import { mediumHaptics, successHaptics } from "@/utils/haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function EditCalendarModal() {
  const router = useRouter();
  const {
    logDate,
    catIdParams,
    catNameParams,
    defecationParams,
    vitaminParams,
    weightParams,
    etcParams,
    logDateIdParams,
  } = useLocalSearchParams();
  return (
    <Animated.View className="items-center justify-end flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View
        entering={SlideInDown}
        className="flex flex-col items-center w-full shadow-lg rounded-xl bg-snow "
      >
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/DailyLog/[logDate]",
              params: {
                logDate: logDate.toString(),
                catIdParams,
                catNameParams,
                defecationParams,
                vitaminParams,
                weightParams,
                etcParams,
              },
            });
            successHaptics();
          }}
          className="w-full p-6 border-b border-[#ddd]"
          android_ripple={{ color: "#ddd" }}
        >
          <Text className="text-lg font-medium text-center">일일 건강 기록 수정</Text>
        </Pressable>

        <Pressable
          className="w-full p-6 border-b"
          android_ripple={{ color: "#ddd" }}
          onPress={() => {
            router.push({
              pathname: "/DeleteCalendarModal",
              params: { logDateIdParams },
            });
            mediumHaptics();
          }}
        >
          <Text className="font-medium text-lg text-center text-[#ff0000]">삭제</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
