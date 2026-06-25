import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/src/components/layout";

const logoImage = require("../../../assets/images/Nutelyt-logo.png");

export function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding" as never);
    }, 1300);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer className="bg-white" contentClassName="px-0 py-0">
      <View className="flex-1 items-center justify-center overflow-hidden bg-white">
        <View className="absolute -left-24 -top-28 h-[360px] w-[260px] rounded-full bg-[#61DE8A] opacity-10" />
        <View className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-[#61DE8A] opacity-10" />
        <View className="absolute -bottom-28 -right-24 h-[380px] w-[280px] rounded-full bg-[#8CCDFF] opacity-10" />
        <View className="absolute bottom-16 right-8 h-40 w-40 rounded-full bg-[#8CCDFF] opacity-10" />

        <View
          className="items-center justify-center"
          style={{ transform: [{ translateY: -16 }] }}
        >
          <View className="absolute h-[286px] w-[286px] rounded-full border border-primary-100 opacity-80" />
          <View className="h-[104px] w-[272px] items-center justify-center">
            <Image
              accessibilityLabel="Nutelyt"
              className="h-full w-full"
              resizeMode="contain"
              source={logoImage}
            />
          </View>
        </View>

        <View
          className="absolute items-center gap-4"
          style={{ bottom: Math.max(insets.bottom + 44, 64) }}
        >
          <View className="flex-row items-center gap-2 rounded-full bg-[#EEEEF0] px-4 py-2">
            <View className="h-3.5 w-3 rounded-full bg-primary-600" />
            <Text className="text-sm font-semibold tracking-[0.14px] text-muted">
              Powered by Advanced AI
            </Text>
          </View>
          <View className="h-1 w-12 overflow-hidden rounded-full bg-[#E2E2E5]">
            <View className="h-full w-full rounded-full bg-primary-600" />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
