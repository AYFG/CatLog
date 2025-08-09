import { Pressable, View, Text } from "react-native";

interface SubmitButtonProps {
  children: React.ReactNode;
  handleSubmit: () => void;
}

export default function SubmitButton({ children, handleSubmit }: SubmitButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: "#f5d4e0" }}
      onPress={handleSubmit}
      className="flex items-center p-4 mt-10 rounded-lg bg-wePeep"
    >
      <Text className="text-snow">{children}</Text>
    </Pressable>
  );
}
