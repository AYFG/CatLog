import { Pressable, View, Text } from "react-native";

interface SubmitButtonProps {
  children: React.ReactNode;
  handleSubmit: () => void;
}

export default function SubmitButton({ children, handleSubmit }: SubmitButtonProps) {
  return (
    <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
      <Pressable onPress={handleSubmit}>
        <Text className="text-snow">{children}</Text>
      </Pressable>
    </View>
  );
}
