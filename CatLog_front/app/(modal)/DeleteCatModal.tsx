import { UserData } from "@/types/auth";
import { CatData } from "@/types/cat";
import { apiRequest } from "@/utils/fetchApi";
import { successHaptics } from "@/utils/haptics";
import { getData } from "@/utils/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function DeleteCatModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { catId } = useLocalSearchParams();
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
    mutationFn: (catId: CatData["_id"]) =>
      apiRequest(`cat/${catId}`, "DELETE", undefined, userData?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"], refetchType: "all" });
      router.push("/(tabs)/mypage/MyPage");
    },
  });

  const deleteCatHandler = (catId: CatData["_id"]) => {
    mutation.mutate(catId);
    successHaptics();
  };
  return (
    <Animated.View className="items-center justify-center flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View entering={SlideInDown} className="flex w-3/5 shadow-lg rounded-xl bg-snow">
        <Text className="mt-5 mb-3 ml-5 font-bold">정말 삭제할까요?</Text>
        <Text className="ml-5">삭제하면 기록들도 함께 사라지고</Text>
        <Text className="ml-5">복구 할 수 없어요.</Text>
        <View className="flex flex-row items-center justify-center my-4">
          <View className=" font-bold flex-1 ml-4 mr-2 py-4 rounded-lg h-14 bg-[#e9ecef]">
            <Pressable onPress={() => router.back()} android_ripple={{ color: "#ddd" }}>
              <Text className="font-bold text-center">취소</Text>
            </Pressable>
          </View>
          <View className="items-center justify-center flex-1 py-4 mr-4 rounded-lg h-14 bg-wePeep">
            {mutation.isPending ? (
              <ActivityIndicator size="large" color="#c9e6ee" />
            ) : (
              <Pressable
                onPress={() => deleteCatHandler(catId.toString())}
                android_ripple={{ color: "#f5d4e0" }}
              >
                <Text className="font-bold text-center text-snow">확인</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
