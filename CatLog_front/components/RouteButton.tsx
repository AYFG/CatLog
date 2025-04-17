import {
  ExternalPathString,
  Href,
  Link,
  RelativePathString,
  UnknownInputParams,
  useLocalSearchParams,
} from "expo-router";
import { Pressable, Text, View } from "react-native";

interface RouteButtonProps {
  children: React.ReactNode;
  routeHref: RelativePathString | ExternalPathString | string;
  param?: string;
}

export default function RouteButton({ children, routeHref, param }: RouteButtonProps) {
  console.log(param);
  return (
    <View className="flex items-center w-full p-4 my-10 rounded-lg bg-wePeep">
      <Link
        href={{ pathname: routeHref as RelativePathString, params: { logDate: param } }}
        className="flex items-center w-full p-4"
      >
        <Text className="text-center text-snow">{children}</Text>
      </Link>
    </View>
  );
}
