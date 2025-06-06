import { loginError } from "@/types/error";
import { apiRequest } from "@/utils/fetchApi";
import { setData } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/adaptive-icon.png";

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
  const validate = () => {
    if (email === "") {
      newErrors.email = "이메일을 입력해주세요";
    }

    if (password === "") {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = () => {
    if (!validate()) {
      return;
    }
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
            className={`p-4 border-2 ${
              checkValidation.email ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="이메일을 입력해주세요"
            placeholderTextColor="#777777"
            value={email}
            onChangeText={setEmail}
          />
          {checkValidation.email && <Text className="text-[#ff0000]">{checkValidation.email}</Text>}
        </View>
        <View className="">
          <Text className="mb-4 font-bold">비밀번호</Text>
          <TextInput
            className={`text-[#777777] p-4 border-2 ${
              checkValidation.password ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="비밀번호"
            placeholderTextColor="#777777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {checkValidation.password && (
            <Text className="text-[#ff0000]">{checkValidation.password}</Text>
          )}
        </View>

        <Pressable
          android_ripple={{ color: "#f5d4e0" }}
          className="flex items-center justify-center h-16 p-4 mt-10 rounded-lg bg-wePeep "
          onPress={handleLogin}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator size="large" color="#c9e6ee" />
          ) : (
            <Text className="text-lg text-snow">로그인</Text>
          )}
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
