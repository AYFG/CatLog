import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
cssInterop(Image, { className: "style" });

type socialButtonProps = {
  source: string;
  onPress: () => void;
};

export default function socialButton({ source, onPress }: socialButtonProps) {
  return (
    <View className="">
      <Pressable onPress={onPress} className="w-50 h-50">
        <Image source={source} contentFit="cover" className="h-14 w-14" />
      </Pressable>
    </View>
  );
}
