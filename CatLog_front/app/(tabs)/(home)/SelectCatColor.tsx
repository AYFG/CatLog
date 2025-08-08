import RiveCatAnimation from "@/components/RiveCatAnimation";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import * as Haptics from "expo-haptics";
import { getData, setData } from "@/utils/storage";
import { useCatTypeStore } from "@/store/useCatStore";
import { useRouter } from "expo-router";

export default function SelectCatColor() {
  const catTypeArray = ["WhiteCat", "BlackCat", "CheeseCat", "SphynxCat", "MackerelCat"];
  const [catIndex, setCatIndex] = useState(0);
  const { catType, setCatType } = useCatTypeStore();
  const router = useRouter();

  useEffect(() => {
    const loadArtBoard = async () => {
      const asyncCatData = await getData("catData");
      if (asyncCatData) {
        setCatType(asyncCatData);
        const savedIndex = catTypeArray.indexOf(asyncCatData);
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
      const newIndex = prevIdx === 0 ? catTypeArray.length - 1 : prevIdx - 1;
      setCatType(catTypeArray[newIndex]);
      return newIndex;
    });
  };

  const nextChangeCatButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCatIndex((prevIdx) => {
      const newIndex = prevIdx === catTypeArray.length - 1 ? 0 : prevIdx + 1;
      setCatType(catTypeArray[newIndex]);
      return newIndex;
    });
  };

  const catTypeSubmitButton = () => {
    router.push("/");
    setData("catData", catTypeArray[catIndex]);
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="flex flex-row items-center w-full pt-16 pb-4">
        <Pressable
          className="ml-2"
          onPress={prevChangeCatButton}
          android_ripple={{ color: "lightgray", radius: 25 }}
        >
          <AntDesign name="leftcircle" size={48} color="black" />
        </Pressable>

        <RiveCatAnimation catTypeProp={catType} movementState="BasicMovement" />

        <Pressable
          className="mr-2"
          onPress={nextChangeCatButton}
          android_ripple={{ color: "lightgray", radius: 25 }}
        >
          <AntDesign name="rightcircleo" size={48} color="black" />
        </Pressable>
      </View>

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
