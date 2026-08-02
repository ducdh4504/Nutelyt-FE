import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AUTH_FONTS, authColors } from "../auth-theme";
import { authAssets } from "../data/auth-assets";

type AuthScreenShellProps = {
  children: ReactNode;
  decoration?: boolean;
  mainPaddingTop: number;
};

export function AuthScreenShell({
  children,
  decoration = false,
  mainPaddingTop,
}: AuthScreenShellProps) {
  useFonts(AUTH_FONTS);
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
      style={styles.background}
    >
      <StatusBar style="dark" />
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {decoration ? (
          <Image
            accessibilityElementsHidden
            contentFit="cover"
            importantForAccessibility="no-hide-descendants"
            source={authAssets.registerDecoration}
            style={styles.decoration}
          />
        ) : null}

        <View className="h-16 items-center justify-center px-5">
          <Image
            accessibilityLabel="Nutelyt"
            contentFit="contain"
            source={authAssets.wordmark}
            style={styles.wordmark}
          />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom + 32, 40),
            paddingHorizontal: 20,
            paddingTop: mainPaddingTop,
          }}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[350px] self-center">{children}</View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: authColors.background },
  decoration: {
    borderRadius: 200,
    bottom: -52,
    height: 400,
    left: -119,
    opacity: 0.1,
    position: "absolute",
    width: 400,
  },
  wordmark: { height: 32, width: 113.77 },
});
