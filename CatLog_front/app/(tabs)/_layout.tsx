import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#faeee5",
        headerStyle: { backgroundColor: "rgb(250, 209, 216)" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#f2c4d6",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={focused ? 27 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar-sharp" : "calendar-outline"}
              color={color}
              size={focused ? 27 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MyPage"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "user-alt" : "user"}
              color={color}
              size={focused ? 27 : 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
