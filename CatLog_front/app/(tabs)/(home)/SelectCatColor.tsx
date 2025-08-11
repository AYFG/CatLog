import { CAT_TYPE_ARRAY } from "@/assets/images/catImages";
import SubmitButton from "@/components/button/SubmitButton";
import RiveCatAnimation from "@/components/Rive/RiveCatAnimation";
import { getData, setData } from "@/utils/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectCatColor() {
  const [catIndex, setCatIndex] = useState(0);
  const [catType, setCatType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadArtBoard = async () => {
      const storedCatTypeData = await getData("catData");
      if (storedCatTypeData) {
        setCatType(storedCatTypeData);
        const savedIndex = CAT_TYPE_ARRAY.indexOf(storedCatTypeData);
        if (savedIndex !== -1) {
          setCatIndex(savedIndex);
        }
      }
    };
    loadArtBoard();
  }, []);

  const prevChangeCatButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCatIndex((prevIdx) => {
      const newIndex = prevIdx === 0 ? CAT_TYPE_ARRAY.length - 1 : prevIdx - 1;
      setCatType(CAT_TYPE_ARRAY[newIndex]);
      return newIndex;
    });
  };

  const nextChangeCatButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCatIndex((prevIdx) => {
      const newIndex = prevIdx === CAT_TYPE_ARRAY.length - 1 ? 0 : prevIdx + 1;
      setCatType(CAT_TYPE_ARRAY[newIndex]);
      return newIndex;
    });
  };

  const catTypeSubmitButton = () => {
    router.push("/");
    setData("catData", CAT_TYPE_ARRAY[catIndex]);
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="flex flex-row items-center w-full px-8 pt-16 pb-4">
        <Pressable
          className=""
          onPress={prevChangeCatButton}
          android_ripple={{ color: "gray", radius: 25 }}
        >
          <AntDesign name="leftcircleo" size={48} color="black" />
        </Pressable>

        <RiveCatAnimation catTypeProp={catType} movementState="BasicMovement" />

        <Pressable
          className=""
          onPress={nextChangeCatButton}
          android_ripple={{ color: "gray", radius: 25 }}
        >
          <AntDesign name="rightcircleo" size={48} color="black" />
        </Pressable>
      </View>
      <Text className="text-center"></Text>
      <View className="w-1/2 m-auto">
        <SubmitButton
          children={<Text className="text-xl font-semibold color-[#EF798A]}">캐릭터 저장하기</Text>}
          handleSubmit={async () => {
            catTypeSubmitButton();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
