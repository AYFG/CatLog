import images from "@/assets/images/catImages";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Rive from "rive-react-native";

export const BasicMovement = "BasicMovement";

export default function RiveCatAnimation({
  movementState,
  catTypeProp,
}: {
  movementState: string;
  catTypeProp?: string;
}) {
  const [catType, setCatType] = useState("");

  useEffect(() => {
    if (catTypeProp) {
      setCatType(catTypeProp);
    }
  }, [catTypeProp]);

  if (__DEV__) {
    const imageKey = (catType || "WhiteCat") as keyof typeof images;

    return (
      <View style={{ width: 200, height: 300, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={images[imageKey] || images.WhiteCat}
          contentFit="contain"
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <Rive
      resourceName="catlog"
      artboardName={catType}
      stateMachineName={movementState}
      autoplay={true}
      style={{ width: 200, height: 300 }}
    />
  );
}
