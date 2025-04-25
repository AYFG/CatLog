import "@/global.css";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Pressable, Text, View } from "react-native";
import ReLogin from "../ReLogin";
import Rive from "rive-react-native";
import test from "@/assets/images/backgroundTest.jpg";

export default function App() {
  const router = useRouter();
  const [notLogin, setNotLogin] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats, setCats } = useCatStore();
  useEffect(() => {
    const fetchData = async () => {
      const storedUserData = await getData("userData");
      if (storedUserData == null) {
        router.replace("/Login");
      } else {
        setUserData(storedUserData);
        setNotLogin(false);
      }
    };
    fetchData();
  }, []);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["cats"],
    queryFn: () =>
      apiRequest(`cat/${userData?.userId}`, "GET", undefined, userData?.accessToken || ""),
    enabled: userData !== null,
  });
  useEffect(() => {
    if (isSuccess && data) {
      setCats(data.cats);
    }
  }, [data]);
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#dbc0e7" />
      </View>
    );
  }
  if (isError) {
    return <ReLogin />;
  }

  if (notLogin) {
    return <ReLogin />;
  }

  return (
    <View className="flex-1 bg-snow">
      <View className="flex items-center justify-center">
        <ImageBackground source={test} resizeMode="cover" style={{ width: 200, height: 200 }}>
          {/* <Rive
            resourceName="whitecat"
            artboardName="WhiteCat 2"
            stateMachineName="BasicMovement"
            // style={{ width: 100, height: 100 }}
          /> */}
        </ImageBackground>
      </View>
    </View>
  );
}
