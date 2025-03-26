import { getData, removeData } from "@/utils/storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("userData");
      setUserData(data);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    removeData("userData");
    router.push("/Login");
  };
  return (
    <View>
      <Pressable onPress={handleLogout}>
        <Text>로그아웃</Text>
      </Pressable>
      <Pressable>
        <Text>고양 정보 수정</Text>
      </Pressable>
      <Text>{userData && userData.name}</Text>
    </View>
  );
}
