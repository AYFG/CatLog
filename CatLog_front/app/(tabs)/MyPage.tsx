import { useCatStore } from "@/store/useCatStore";
import { calculateAge } from "@/utils/calculateAge";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats } = useCatStore();
  useEffect(() => {
    const getUserData = async () => {
      const data = await getData("userData");
      setUserData(data);
    };
    getUserData();
  }, []);

  const mutation = useMutation({
    mutationFn: (catId: CatData["_id"]) =>
      apiRequest(`cat/${catId}`, "DELETE", undefined, userData?.accessToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });
  const deleteCatHandler = (catId: CatData["_id"]) => {
    mutation.mutate(catId);
    console.log("고양이가 삭제되었습니다:", catId);
  };

  return (
    <ScrollView>
      <Link href="/LogoutModal" className="ml-auto">
        <Ionicons name="log-out-outline" size={24} color="black" />
        <Text>로그아웃</Text>
      </Link>
      <View className="m-10">
        <Text className="w-full mb-5 text-center">{userData && userData.name}의 반려묘</Text>
        <View className="flex flex-row flex-wrap gap-10 ">
          {cats?.map((v: CatData) => (
            <View className="flex flex-col w-full border" key={v._id}>
              <View className="flex items-center justify-center">
                <Image
                  source={require("@/assets/images/testCat.png")}
                  style={{ width: 100, height: 100 }}
                />
                <View className="mb-3">
                  <Link
                    href={{
                      pathname: "/ChangeCat/[id]",
                      params: { catId: v._id, name: v.name, birthDay: v.birthDate },
                    }}
                  >
                    <Text>정보 수정</Text>
                  </Link>
                </View>
                <Button title="삭제" onPress={() => deleteCatHandler(v._id)} />
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
