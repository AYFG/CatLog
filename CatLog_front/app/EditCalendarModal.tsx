import React from "react";

import { apiRequest } from "@/utils/fetchApi";
import { getData, removeData } from "@/utils/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  } = useLocalSearchParams();
  return (
    <Animated.View className="items-center justify-end flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View
        entering={SlideInDown}
        className="flex flex-col items-center w-full shadow-lg rounded-xl bg-snow "
      >
        <Link
          href={{
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
          }}
        >
          <View className="w-full p-6 border-b border-[#ddd]">
            <Text className="text-lg font-medium text-center">일일 건강 기록 수정</Text>
          </View>
        </Link>

        <Link
          href={{
            pathname: "/DeleteCatModal",
          }}
        >
          <View className="w-full p-6 border-b">
            <Text className="font-medium text-lg text-center text-[#ff0000]">삭제</Text>
          </View>
        </Link>
      </Animated.View>
    </Animated.View>
  );
}
