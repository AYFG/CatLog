import "@/global.css";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Rive from "rive-react-native";

export default function App() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-snow">
      <View className="flex items-center justify-center">
        <Rive
          resourceName="catlog"
          artboardName="WhiteCat"
          stateMachineName="BasicMovement"
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/Login")}>
          <Text>로그인 페이지</Text>
        </Pressable>
      </View>
      <View className="p-10 bg-prelude">
        <Pressable onPress={() => router.push("/CalendarScreen")}>
          <Text>반려묘의 루틴을 등록해보세요</Text>
        </Pressable>
      </View>
    </View>
  );
}
