import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function EditCatModal() {
  const router = useRouter();
  const {
    catId,
    birthDay,
    catTypeParams,
    nameParams,
    healthDateParams,
    healthCycleParams,
    heartWormParams,
    heartWormCycleParams,
  } = useLocalSearchParams();

  return (
    <Animated.View className="items-center justify-end flex-1 bg-[#00000040]" entering={FadeIn}>
      <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

      <Animated.View
        entering={SlideInDown}
        className="flex flex-col items-center w-full shadow-lg rounded-xl bg-snow "
      >
        <Pressable
          className="w-full p-6 border-b border-[#ddd]"
          android_ripple={{ color: "#ddd" }}
          onPress={() => {
            router.push({
              pathname: "/MedicalLog",
              params: {
                catId: catId,
                nameParams: nameParams,
                healthDateParams: healthDateParams,
                healthCycleParams: healthCycleParams,
                heartWormParams: heartWormParams,
                heartWormCycleParams: heartWormCycleParams,
              },
            });
          }}
        >
          <Text className="text-lg font-medium text-center">건강 기록 수정</Text>
        </Pressable>

        <Pressable
          className="w-full p-6 border-b border-[#ddd]"
          android_ripple={{ color: "#ddd" }}
          onPress={() => {
            router.push({
              pathname: "/ChangeCat/[catId]",
              params: {
                catId: catId.toString() || "",
                nameParams: nameParams || "",
                birthDay: birthDay,
                catTypeParams: catTypeParams,
              },
            });
          }}
        >
          <Text className="text-lg font-medium text-center">반려묘 정보 수정</Text>
        </Pressable>

        <Pressable
          className="w-full p-6 border-b"
          android_ripple={{ color: "#ddd" }}
          onPress={() => {
            router.push({
              pathname: "/DeleteCatModal",
              params: {
                catId: catId,
              },
            });
          }}
        >
          <Text className="font-medium text-lg text-center text-[#ff0000]">삭제</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
