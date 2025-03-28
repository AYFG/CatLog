import { calculateAge } from "@/utils/calculateAge";
import { apiRequest } from "@/utils/fetchApi";
import { getData, removeData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

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
    <View>
      <Pressable onPress={handleLogout}>
        <Text>로그아웃</Text>
      </Pressable>
      <Pressable>
        <Text>고양 정보 수정</Text>
      </Pressable>
      <Text>{userData && userData.name}의 반려묘</Text>
      <View>
        {data.cats.map((v: CatData) => (
          <View className="flex flex-row gap-10">
            <Text key={v._id}>{v.name}</Text>
            <Text>{calculateAge(v.birthDate)}살</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
