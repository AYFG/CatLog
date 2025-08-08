import { useCatTypeStore } from "@/store/useCatStore";
import { getData } from "@/utils/storage";
import { useEffect, useState } from "react";
import Rive from "rive-react-native";

export default function RiveCatAnimation({
  movementState,
  catTypeProp,
}: {
  movementState: string;
  catTypeProp?: string;
}) {
  const { catType, setCatType } = useCatTypeStore();

  useEffect(() => {
    if (catTypeProp) {
      setCatType(catTypeProp);
    }
  }, [catType]);
  return (
    <Rive
      resourceName="catlog"
      artboardName={catType}
      stateMachineName={movementState}
      autoplay={true}
      style={{ width: 300, height: 300 }}
    />
  );
}
