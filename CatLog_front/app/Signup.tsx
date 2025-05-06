import { signupError } from "@/types/error";
import { apiRequest } from "@/utils/fetchApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/adaptive-icon.png";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};

  const mutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      apiRequest("auth/signup", "POST", { email, password, name }),
    onSuccess: () => {
      router.push("/Login");
    },
    onError: (error: signupError) => {
      if (error.data[0].path === "email") {
        newErrors.email = error.data[0].msg;
      }
      if (error.data[0].path === "name") {
        newErrors.name = error.data[0].msg;
      }
      if (error.data[0].path === "password") {
        newErrors.password = error.data[0].msg;
      }
      setCheckValidation(newErrors);
    },
  });

  const validate = () => {
    if (email === "") {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!email.includes("@")) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (name.trim().length < 2) {
      newErrors.name = "닉네임은 2글자 이상이어야 합니다.";
    }

    if (password.length < 6) {
      newErrors.password = "비밀번호는 6글자 이상이어야 합니다.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) {
      return;
    }
    mutation.mutate({
      email: email,
      password: password,
      name: name,
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
            className={`p-4 border-2 ${
              checkValidation.email ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="이메일을 입력해주세요"
            value={email}
            onChangeText={setEmail}
          />
          {checkValidation.email && <Text className="text-[#ff0000]">{checkValidation.email}</Text>}
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">닉네임</Text>
          <TextInput
            className={`p-4 border-2 ${
              checkValidation.name ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="닉네임을 입력해주세요"
            value={name}
            onChangeText={setName}
          />
          {checkValidation.name && <Text className="text-[#ff0000]">{checkValidation.name}</Text>}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">비밀번호</Text>
          <TextInput
            className={`p-4 border-2 ${
              checkValidation.password ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {checkValidation.password && (
            <Text className="text-[#ff0000]">{checkValidation.password}</Text>
          )}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">비밀번호 확인</Text>
          <TextInput
            className={`p-4 border-2 ${
              checkValidation.confirmPassword ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        {checkValidation.confirmPassword && (
          <Text className="text-[#ff0000]">{checkValidation.confirmPassword}</Text>
        )}
        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={handleSignup} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <View className="">
                <ActivityIndicator size="large" color="#c9e6ee" />
              </View>
            ) : (
              <Text className="text-snow">회원가입</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
