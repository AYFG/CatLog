import { mediumHaptics } from "@/utils/haptics";
import { ExternalPathString, Link, RelativePathString } from "expo-router";
import { Pressable, Text } from "react-native";
interface RouteButtonProps {
  children: React.ReactNode;
  routeHref: RelativePathString | ExternalPathString | string;
  param?: Record<string, string>;
}

export default function RouteButton({ children, routeHref, param }: RouteButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: "#f5d4e0" }}
      className="flex items-center p-4 rounded-lg bg-wePeep "
    >
      <Link
        href={{ pathname: routeHref as RelativePathString, params: param }}
        onPress={() => {
          mediumHaptics();
        }}
      >
        <Text className="text-xl font-semibold text-center text-snow">{children}</Text>
      </Link>
    </Pressable>
  );
}
