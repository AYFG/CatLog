import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
export default function RootLayout() {
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/LogoutModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="(modal)/EditCatModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="(modal)/DeleteCatModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="(modal)/EditCalendarModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="(modal)/DeleteCalendarModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="(modal)/DeleteUserModal"
          options={{ headerShown: false, presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen name="Signup" options={{ headerShown: false }} />
        <Stack.Screen name="CreateCat" options={{ headerShown: false }} />
        <Stack.Screen name="DailyLog/[logDate]" options={{ headerShown: false }} />
        <Stack.Screen name="ChangeCat/[catId]" options={{ headerShown: false }} />
        <Stack.Screen name="MedicalLog" options={{ headerShown: false }} />
        <Stack.Screen name="Settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
