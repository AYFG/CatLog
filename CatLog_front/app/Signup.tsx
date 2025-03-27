import { apiRequest } from "@/utils/fetchApi";
import { Image } from "expo-image";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/splash-Image.png";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Signup() {
  const router = useRouter();
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSignup = async (email: string, password: string, name: string) => {
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }
    return apiRequest("auth/signup", "POST", { email, password, name })
      .then((res) => {
        router.push("/Login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View className="flex-1 bg-snow">
      <View className="mx-6">
        <SafeAreaView className="flex flex-row items-center mt-2 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="items-center flex-1 mr-7">
            <Image className="" source={logo} style={{ width: 60, height: 60 }} />
          </View>
        </SafeAreaView>

        <View className="mb-8">
          <Text className="mb-4 text-xl font-bold">회원가입</Text>
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
        <View className="mb-2">
          <Text className="mb-4 font-bold">닉네임</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="닉네임을 입력해주세요"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">비밀번호</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">비밀번호 확인</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        {passwordMismatch && (
          <Text style={{ color: "red", marginBottom: 10 }}>비밀번호가 일치하지 않습니다.</Text>
        )}
        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={() => handleSignup(email, password, name)}>
            <Text className="text-snow">회원가입</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
