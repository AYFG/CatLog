import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="mx-6 ">
        <View className="flex flex-row items-center mt-8 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="items-center flex-1 mr-7">
            <Text className="text-xl font-semibold ">설정</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/DeleteUserModal")}
          android_ripple={{ color: "#ddd" }}
          className="flex flex-row items-center justify-between p-4 mt-6 border-b-2 border-[#ddd] rounded-lg"
        >
          <Text className="text-lg font-medium">회원탈퇴</Text>
          <Ionicons name="chevron-forward-outline" size={24} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
