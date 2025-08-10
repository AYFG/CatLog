import { useEffect, useState } from "react";
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
