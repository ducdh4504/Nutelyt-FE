import "../../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { cssInterop } from "nativewind";
import "react-native-reanimated";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { MainProfileProvider } from "@/features/profile";

cssInterop(Image, { className: "style" });

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const appContent = (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MainProfileProvider>
        <View style={styles.appHost}>
          <Stack screenOptions={{ contentStyle: styles.navigatorContent }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="(tabs)"
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="health-profile" options={{ headerShown: false }} />
            <Stack.Screen
              name="profile/settings"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="subscription" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              name="health-profile-summary"
              options={{ headerShown: false }}
            />
          </Stack>
        </View>
      </MainProfileProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webBackground}>
        <View style={styles.webAppFrame}>{appContent}</View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  appHost: {
    backgroundColor: "#FAFAF7",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  navigatorContent: {
    backgroundColor: "#FAFAF7",
    flex: 1,
    minHeight: 0,
  },
  webAppFrame: {
    backgroundColor: "#FAFAF7",
    flex: 1,
    height: "100%" as ViewStyle["height"],
    maxWidth: 430,
    minHeight: 0,
    overflow: "hidden",
    width: "100%",
  },
  webBackground: {
    alignItems: "center",
    backgroundColor: "#111827",
    flex: 1,
    height: "100%" as ViewStyle["height"],
    minHeight: 0,
    overflow: "hidden",
    width: "100%",
  },
});
