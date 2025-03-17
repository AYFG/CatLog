import { apiRequest } from "@/utils/fetchApi";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View, Button } from "react-native";

export default function Signup() {
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
    <View className="items-center justify-center flex-1">
      <Text>회원가입</Text>
      <TextInput placeholder="id" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {passwordMismatch && (
        <Text style={{ color: "red", marginBottom: 10 }}>비밀번호가 일치하지 않습니다.</Text>
      )}
      <TextInput placeholder="name" value={name} onChangeText={setName} />
      <Button title="Signup" onPress={() => handleSignup(email, password, name)} />
    </View>
  );
}
