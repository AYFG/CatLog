import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/adaptive-icon.png";
import RouteButton from "@/components/RouteButton";
import { useEffect, useState } from "react";

export default function Welcome() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      router.push("/Login");
      return;
    }
    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <View className="flex-1 bg-snow">
      <View className="mx-6">
        <SafeAreaView className="flex flex-row items-center mt-2 mb-6">
          <View className="items-center flex-1 ">
            <Image className="" source={logo} style={{ width: 60, height: 60 }} />
          </View>
        </SafeAreaView>
        <View className="mt-10">
          <Text className="mb-10 text-2xl font-medium text-center">회원가입에 성공했습니다.</Text>
          <View className="flex flex-row items-center justify-center mb-4 ">
            <Text className="mr-2 text-lg font-medium text-center">{count}</Text>
            <Text>초후에 자동으로 로그인 페이지로 이동합니다.</Text>
          </View>

          <RouteButton routeHref="/Login">로그인 하러가기</RouteButton>
        </View>
      </View>
    </View>
  );
}
