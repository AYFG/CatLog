import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import SocialButton from "@/components/socialButton";
import { Link, router } from "expo-router";
import { apiRequest } from "@/utils/fetchApi";
import { useState } from "react";
import { getData, setData } from "@/utils/storage";
import logo from "../assets/images/splash-Image.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await apiRequest("auth/login", "POST", { email, password });
      console.log(res);
      if (res) {
        const userData = res.item;
        await setData("userData", userData);
        await getData("userData");
        router.push("/");
      }
    } catch (err) {
      setValidate(err.message);
      console.error("로그인 실패 : ", err);
    }
  };

  return (
    <View className="flex-1 bg-snow">
      <View className="mx-6">
        <SafeAreaView className="flex items-center mt-2 mb-8">
          <Image className="" source={logo} style={{ width: 60, height: 60 }} />
        </SafeAreaView>
        <View className="mb-8">
          <Text className="mb-4 text-xl font-bold">로그인</Text>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">이메일</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="">
          <Text className="mb-4 font-bold">비밀번호</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable
          className="flex items-center p-4 mt-10 rounded-lg bg-wePeep"
          onPress={() => handleLogin(email, password)}
        >
          <Text className="text-lg text-snow">로그인</Text>
        </Pressable>

        <View className="flex items-center w-full p-2 mt-4 rounded-lg ">
          <Link href="/Signup" className="">
            <Text className="text-[gray]">회원가입</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
