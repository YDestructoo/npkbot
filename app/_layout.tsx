import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="serverconfig">
      <Stack.Screen name="serverconfig" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="fullscreen-camera" options={{ headerShown: false }} />
    </Stack>
  );
}
