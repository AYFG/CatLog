import { calculateAge } from "@/utils/calculateAge";
import { apiRequest } from "@/utils/fetchApi";
import { getData, removeData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [catNames, setCatNames] = useState<string[]>([]);

  const handleLogout = async () => {
    removeData("userData");
    router.push("/Login");
  };

  const fetchGetCat = apiRequest(
    `cat/${userData?.userId}`,
    "GET",
    undefined,
    userData?.accessToken,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getData("userData");
      setUserData(data);
    };
    fetchUserData();
  }, []);
  const { data, isSuccess } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => {
      if (!userData) return [];
      return apiRequest(`cat/${userData.userId}`, "GET", undefined, userData.accessToken);
    },
    enabled: !!userData,
  });
  useEffect(() => {
    if (isSuccess) {
      setCatNames((data?.cats).map((cat: { name: string }) => cat.name));
    }
  }, [data, isSuccess]);

  return (
    <ScrollView>
      <Pressable className="ml-auto" onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text>로그아웃</Text>
      </Pressable>
      <Pressable>
        <Text>고양 정보 수정</Text>
      </Pressable>
      <View className="m-10">
        <Text className="w-full text-center">{userData && userData.name}의 반려묘</Text>
        <View className="flex flex-row flex-wrap gap-10 border">
          {data?.cats.map((v: CatData) => (
            <View className="flex flex-col w-1/5 border">
              <Text className="mb-4" key={v._id}>
                {v.name}
              </Text>
              <Text className="text-center">{calculateAge(v.birthDate)}살</Text>
            </View>
          ))}
          {data?.cats.map((v: CatData) => (
            <View className="flex flex-col w-1/5 border">
              <Text className="mb-4" key={v._id}>
                {v.name}
              </Text>
              <Text className="text-center">{calculateAge(v.birthDate)}살</Text>
            </View>
          ))}
          {data?.cats.map((v: CatData) => (
            <View className="flex flex-col w-1/5 border">
              <Text className="mb-4" key={v._id}>
                {v.name}
              </Text>
              <Text className="text-center">{calculateAge(v.birthDate)}살</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
