import { Text } from "react-native";

import { AUTH_FONT_FAMILY, authColors } from "../auth-theme";

export function AuthFeedback({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="text-sm leading-5"
      style={{ color: authColors.error, fontFamily: AUTH_FONT_FAMILY }}
    >
      {message}
    </Text>
  );
}
