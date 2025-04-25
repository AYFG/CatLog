import { loginError } from "@/types/error";
import { apiRequest } from "@/utils/fetchApi";
import { setData } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/splash-Image.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiRequest("auth/login", "POST", { email, password }),
    onSuccess: (data) => {
      const userData = data.item;
      setData("userData", userData);
      router.push("/");
    },
    onError: (error: loginError) => {
      if (error.name === "email") {
        newErrors.email = error.message;
      }
      if (error.name === "password") {
        newErrors.password = error.message;
      }
      setCheckValidation(newErrors);
    },
  });

  const handleLogin = () => {
    mutation.mutate({
      email,
      password,
    });
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
          {checkValidation.email && <Text className="text-[#ff0000]">{checkValidation.email}</Text>}
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
          {checkValidation.password && (
            <Text className="text-[#ff0000]">{checkValidation.password}</Text>
          )}
        </View>

        <Pressable
          className="flex items-center p-4 mt-10 rounded-lg bg-wePeep"
          onPress={handleLogin}
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
