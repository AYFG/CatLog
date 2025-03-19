import "@/global.css";
import Rive from "rive-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function App() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View>
        <Rive
          resourceName="testcat"
          artboardName="WhiteCat"
          stateMachineName="State Machine 1"
          style={{ width: 200, height: 100 }}
        />
      </View>
      <Pressable onPress={() => router.push("/CalendarScreen")}>
        <Text className="p-10 mb-10 bg-prelude">반려묘의 루틴을 등록해보세요</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/Login")}>
        <Text className="p-10 bg-prelude">로그인 페이지</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
