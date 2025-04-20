import "@/global.css";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import ReLogin from "../ReLogin";

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
  }, [data, isSuccess]);
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
  console.log(data);

  return (
    <View className="flex-1 bg-snow">
      <View className="flex items-center justify-center">
        {/* <Rive
          resourceName="catlog"
          artboardName="WhiteCat"
          stateMachineName="BasicMovement"
          style={{ width: 200, height: 200, backgroundColor: "#ebebeb" }}
        /> */}
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/Login")}>
          <Text>로그인 페이지</Text>
        </Pressable>
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/MyCat")}>
          <Text>고양이 정보</Text>
        </Pressable>
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/MedicalLog")}>
          <Text>메디컬 로그 작성</Text>
        </Pressable>
      </View>
    </View>
  );
}
