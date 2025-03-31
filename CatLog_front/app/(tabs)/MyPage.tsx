import { useCatStore } from "@/store/useCatStore";
import { calculateAge } from "@/utils/calculateAge";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [catNames, setCatNames] = useState<string[]>([]);
  const { cats, setCats } = useCatStore();

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
      setCats(data.cats);
    }
  }, [data, isSuccess]);

  return (
    <ScrollView>
      <Link href="/LogoutModal" className="ml-auto">
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text>로그아웃</Text>
      </Link>
      <View className="m-10">
        <Text className="w-full mb-5 text-center">{userData && userData.name}의 반려묘</Text>
        <View className="flex flex-row flex-wrap gap-10 ">
          {data?.cats.map((v: CatData) => (
            <View className="flex flex-col w-full border" key={v._id}>
              <View className="flex items-center justify-center">
                <Image
                  source={require("@/assets/images/testCat.png")}
                  style={{ width: 100, height: 100 }}
                />
              </View>
              <Text className="mb-4 text-center">{v.name}</Text>
              <Text className="text-center">{calculateAge(v.birthDate)}살</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
