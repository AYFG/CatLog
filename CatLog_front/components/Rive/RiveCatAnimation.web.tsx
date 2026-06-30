import images from "@/assets/images/catImages";
import { Image } from "expo-image";
import { View } from "react-native";

export const BasicMovement = "BasicMovement";

export default function RiveCatAnimation({ catTypeProp }: { movementState: string; catTypeProp?: string }) {
  const catType = (catTypeProp || "WhiteCat") as keyof typeof images;

  return (
    <View style={{ width: 200, height: 300, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={images[catType] || images.WhiteCat}
        contentFit="contain"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
