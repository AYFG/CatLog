import { ExternalPathString, Link, RelativePathString } from "expo-router";
import { Text, View } from "react-native";

interface RouteButtonProps {
  children: React.ReactNode;
  routeHref: RelativePathString | ExternalPathString | string;
  param?: Record<string, string>;
}

export default function RouteButton({ children, routeHref, param }: RouteButtonProps) {
  console.log(param);
  return (
    <View className="flex items-center p-4 rounded-lg bg-wePeep">
      <Link
        href={{ pathname: routeHref as RelativePathString, params: param }}
        className="flex items-center "
      >
        <Text className="text-xl font-semibold text-center text-snow">{children}</Text>
      </Link>
    </View>
  );
}
