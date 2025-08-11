import { UserData } from "@/types/auth";
import { CatData } from "@/types/cat";
import { DailyLogData } from "@/types/dailyLog";
import { apiRequest } from "@/utils/fetchApi";
import { successHaptics } from "@/utils/haptics";
import { getData } from "@/utils/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function DeleteCalendarModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { logDateIdParams } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const storedUserData = await getData("userData");
      if (storedUserData == null) {
        router.replace("/Login");
      } else {
        setUserData(storedUserData);
      }
    };
    fetchData();
  }, []);

  const mutation = useMutation({
    mutationFn: (logDateIdParams: DailyLogData["_id"]) =>
      apiRequest(`dailyLog/${logDateIdParams}`, "DELETE", undefined, userData?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLog"], refetchType: "all" });
      router.push("/(tabs)/calendar/CalendarScreen");
    },
  });

  const deleteCatHandler = (catId: CatData["_id"]) => {
    mutation.mutate(logDateIdParams.toString());
    successHaptics();
  };
  return (
    <Animated.View className="items-center justify-center flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View entering={SlideInDown} className="flex w-3/5 shadow-lg rounded-xl bg-snow">
        <Text className="mt-5 mb-3 ml-5 font-bold">정말 삭제할까요?</Text>
        <Text className="ml-5">삭제하면 복구 할 수 없어요.</Text>

        <View className="flex flex-row items-center justify-center my-4">
          <View className=" font-bold flex-1 ml-4 mr-2 py-4 rounded-lg bg-[#e9ecef]">
            <Pressable onPress={() => router.back()} android_ripple={{ color: "#ddd" }}>
              <Text className="font-bold text-center">취소</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => deleteCatHandler(logDateIdParams.toString())}
            className="items-center justify-center flex-1 py-4 mr-4 rounded-lg bg-wePeep h-14"
            android_ripple={{ color: "#f5d4e0" }}
          >
            {mutation.isPending ? (
              <ActivityIndicator size="large" color="#c9e6ee" />
            ) : (
              <Text className="font-bold text-center text-snow">확인</Text>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
