import { getData } from "@/utils/storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
      <Text>{userData && userData.name}</Text>
    </View>
  );
}
