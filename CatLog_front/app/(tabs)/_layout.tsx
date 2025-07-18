import { Link, router, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, Text } from "react-native";
export default function TabsLayout() {
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
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("/Settings")}
              android_ripple={{ color: "lightgray", radius: 25 }}
              className="p-4 "
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/LogoutModal")}
              android_ripple={{ color: "lightgray", radius: 30 }}
              className="p-4"
            >
              <Text style={{ fontSize: 18, color: "white" }}>로그아웃</Text>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
