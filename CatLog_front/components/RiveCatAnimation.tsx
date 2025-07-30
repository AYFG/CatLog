import Rive from "rive-react-native";

export default function RiveCatAnimation({ riveState }: { riveState: string }) {
  return (
    <Rive
      resourceName="whitecat"
      artboardName="WhiteCat 2"
      stateMachineName={riveState}
      autoplay={true}
      style={{}}
    />
  );
}
