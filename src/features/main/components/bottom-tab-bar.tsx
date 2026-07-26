import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { FeatherName } from "../types";

type TabConfig = {
  icon: FeatherName;
  label: string;
};

const tabs: Record<string, TabConfig> = {
  home: { icon: "home", label: "Nhà" },
  history: { icon: "clock", label: "Lịch sử" },
  "chat-ai": { icon: "message-circle", label: "Chat AI" },
  profile: { icon: "user", label: "Hồ sơ" },
};

const visibleTabNames = ["home", "history", "chat-ai", "profile"];

function BottomTabButton({
  isFocused,
  navigation,
  route,
}: {
  isFocused: boolean;
  navigation: BottomTabBarProps["navigation"];
  route: BottomTabBarProps["state"]["routes"][number];
}) {
  const progress = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const tab = tabs[route.name];

  useEffect(() => {
    Animated.spring(progress, {
      damping: 18,
      stiffness: 220,
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isFocused, progress]);

  if (!tab) {
    return null;
  }

  const onPress = () => {
    const event = navigation.emit({
      canPreventDefault: true,
      target: route.key,
      type: "tabPress",
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <Pressable
      accessibilityLabel={tab.label}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      className="min-w-[68px] flex-1 items-center justify-center overflow-hidden rounded-[12px] py-2"
      onPress={onPress}
    >
      <Animated.View
        className="absolute inset-0 rounded-[12px] bg-primary-50"
        style={{
          opacity: progress,
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        }}
      />

      <Animated.View
        className="items-center justify-center gap-1"
        style={{
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -1],
              }),
            },
          ],
        }}
      >
        <Feather
          color={isFocused ? "#006D37" : "#3D4A3F"}
          name={tab.icon}
          size={19}
        />

        <Text
          className={`text-center text-xs font-semibold leading-4 ${
            isFocused ? "text-primary-700" : "text-muted"
          }`}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes.filter((route) =>
    visibleTabNames.includes(route.name),
  );

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center gap-2 bg-card px-6 pt-3"
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {visibleRoutes.map((route) => {
        const routeIndex = state.routes.findIndex(
          (item) => item.key === route.key,
        );

        return (
          <BottomTabButton
            isFocused={state.index === routeIndex}
            key={route.key}
            navigation={navigation}
            route={route}
          />
        );
      })}
    </View>
  );
}
