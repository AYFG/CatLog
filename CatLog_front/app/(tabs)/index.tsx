import "@/global.css";
import { getData } from "@/utils/storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Rive from "rive-react-native";

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("userData");
      console.log(data);
      if (data == null) {
        router.push("/Login");
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-snow">
        <Text className="text-lg">다시 로그인 해주세요.</Text>
        <Link href="/Login" className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Text className="text-lg text-snow">로그인 하러가기</Text>
        </Link>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-snow">
      <View className="flex items-center justify-center">
        <Rive
          resourceName="catlog"
          artboardName="WhiteCat"
          stateMachineName="BasicMovement"
          style={{ width: 200, height: 200, backgroundColor: "#ebebeb" }}
        />
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/Login")}>
          <Text>로그인 페이지</Text>
        </Pressable>
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/CalendarScreen")}>
          <Text>반려묘의 루틴을 등록해보세요</Text>
        </Pressable>
      </View>
    </View>
  );
}
