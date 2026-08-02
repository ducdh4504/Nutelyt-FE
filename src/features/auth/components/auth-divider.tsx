import { Text, View } from "react-native";

import { AUTH_FONT_FAMILY } from "../auth-theme";

export function AuthDivider({ label }: { label: string }) {
  return (
    <View accessibilityElementsHidden className="flex-row items-center">
      <View className="h-px flex-1 bg-[#BCCABB]" />
      <Text
        className="px-4 text-center text-base leading-6 text-[#3D4A3E]"
        style={{ fontFamily: AUTH_FONT_FAMILY }}
      >
        {label}
      </Text>
      <View className="h-px flex-1 bg-[#BCCABB]" />
    </View>
  );
}
