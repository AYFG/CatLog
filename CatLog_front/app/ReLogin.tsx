import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ReLogin() {
  return (
    <View className="items-center justify-center flex-1 bg-snow">
      <Text className="text-lg">다시 로그인 해주세요.</Text>
      <Link href="/Login" className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
        <Text className="text-lg text-snow">로그인 하러가기</Text>
      </Link>
    </View>
  );
}
