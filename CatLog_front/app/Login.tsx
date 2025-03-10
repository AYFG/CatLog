import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import SocialButton from "@/components/socialButton";
import { Link } from "expo-router";

export default function Login() {
  const kakaoImage = require("@/assets/images/kakao.png");
  const googleImage = require("@/assets/images/google.png");
  const naverImage = require("@/assets/images/naver.png");

  return (
    <>
      <View className="justify-center mt-10 ">
        <Text>로고 이미지</Text>
      </View>
      <View className="items-center justify-center flex-1">
        <Text className="mb-10">이메일로 로그인</Text>
        <TextInput className="mb-4" placeholder="이메일" />
        <TextInput className="mb-10" placeholder="비밀번호" />

        <Link href="/Signup">
          <Text>회원가입</Text>
        </Link>

        {/* <Text className="mb-10">SNS 로그인</Text>
        <View className="flex-row gap-10 ">
          <SocialButton onPress={() => console.log("test")} source={kakaoImage} />
          <SocialButton onPress={() => console.log("test")} source={naverImage} />
          <SocialButton onPress={() => console.log("test")} source={googleImage} />
        </View> */}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
