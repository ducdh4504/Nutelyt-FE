import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export function AuthCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(188, 202, 187, 0.3)",
    borderRadius: 24,
    borderWidth: 1,
    elevation: 2,
    padding: 24,
    shadowColor: "#006D33",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
  },
});
