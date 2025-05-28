import { UserData } from "@/types/auth";
import { apiRequest } from "@/utils/fetchApi";
import { getData, removeData } from "@/utils/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function DeleteUserModal() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

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
    mutationFn: () =>
      apiRequest(`auth/deleteUser/${userData?.userId}`, "DELETE", undefined, userData?.accessToken),
    onSuccess: () => {
      router.push("/Login");
      removeData("userData");
    },
  });

  const deleteUserHandler = () => {
    mutation.mutate();
  };
  return (
    <Animated.View className="items-center justify-center flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View entering={SlideInDown} className="flex w-3/5 shadow-lg rounded-xl bg-snow">
        <Text className="mt-5 mb-3 ml-5 font-bold">정말 탈퇴하시나요?</Text>
        <Text className="ml-5">탈퇴하면 기록들도 함께 사라지고</Text>
        <Text className="ml-5">복구 할 수 없어요.</Text>
        <View className="flex flex-row items-center justify-center my-4">
          <Pressable
            onPress={() => router.back()}
            android_ripple={{ color: "#ddd" }}
            className=" flex-1 ml-4 mr-2 py-4 rounded-lg bg-[#e9ecef] h-14"
          >
            <Text className="font-bold text-center">취소</Text>
          </Pressable>

          <Pressable
            className="items-center flex-1 py-4 mr-4 rounded-lg h-14 bg-wePeep"
            onPress={deleteUserHandler}
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
