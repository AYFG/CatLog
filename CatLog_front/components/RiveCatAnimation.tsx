import { getData } from "@/utils/storage";
import { useEffect, useState } from "react";
import Rive from "rive-react-native";

export default function RiveCatAnimation({ movementState }: { movementState: string }) {
  const [catColor, setCatColor] = useState("CheeseCat"); // WhiteCat, BlackCat, CheeseCat, MackerelCat,
  useEffect(() => {
    const loadArtBoard = async () => {
      const catData = await getData("catData");
      if (catData) {
        setCatColor(catData?.catColor);
      }
      console.log("catData");
      console.log(catData);
    };
    loadArtBoard();
  }, []);
  return (
    <Rive
      resourceName="catlog"
      artboardName={catColor}
      stateMachineName={movementState}
      autoplay={true}
      style={{ width: 300, height: 300 }}
    />
  );
}
