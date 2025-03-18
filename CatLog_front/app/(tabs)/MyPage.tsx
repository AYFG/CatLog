import { getData } from "@/utils/storage";
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

  return (
    <View>
      <Pressable>
        <Text>로그아웃</Text>
      </Pressable>
      <Pressable>
        <Text>고양 정보 수정</Text>
      </Pressable>
      <Text>{userData && userData.name}</Text>
    </View>
  );
}
