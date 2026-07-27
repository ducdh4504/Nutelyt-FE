import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { logger } from "@/services/logger/logger";

import { ScreenContainer } from "../components/screen-container";
import { onboardingAssets } from "../data/onboarding-assets";

const logoImage = require("@assets/images/Nutelyt-logo.png");
const onboardingWordmarkImage = require("@assets/images/Nutelyt-text.png");

const SPLASH_MIN_DURATION = 2300;

const nextScreenAssets = [
  logoImage,
  onboardingWordmarkImage,
  ...(Array.isArray(onboardingAssets) ? onboardingAssets : []),
];

const prefetchUris = nextScreenAssets
  .map((moduleId) => {
    try {
      const asset = Asset.fromModule(moduleId);
      return asset.uri ?? asset.localUri ?? null;
    } catch {
      return null;
    }
  })
  .filter((uri): uri is string => typeof uri === "string" && uri.length > 0);

export function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [spinValue]);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function preloadAllAssets() {
      const startTime = Date.now();

      try {
        const assetResults = await Promise.allSettled([
          Asset.loadAsync(nextScreenAssets),
          prefetchUris.length > 0
            ? Image.prefetch(prefetchUris, "memory-disk")
            : Promise.resolve(true),
        ]);

        assetResults.forEach((result, index) => {
          if (result.status === "rejected") {
            logger.warn(`Splash preload step ${index} failed:`, result.reason);
          }
        });
      } catch (error) {
        logger.warn("Load splash/onboarding assets failed:", error);
      } finally {
        if (!mounted) return;

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(SPLASH_MIN_DURATION - elapsedTime, 0);

        timer = setTimeout(() => {
          if (!mounted) return;

          router.replace("/onboarding");
        }, remainingTime);
      }
    }

    preloadAllAssets();

    return () => {
      mounted = false;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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

          <Animated.View
            style={{
              position: "absolute",
              width: 306,
              height: 306,
              borderRadius: 153,
              borderWidth: 4,
              borderColor: "#E8F7EF",
              borderTopColor: "#27AE60",
              borderRightColor: "#27AE60",
              transform: [{ rotate: spin }],
            }}
          />

          <View className="h-[104px] w-[272px] items-center justify-center">
            <Image
              accessibilityLabel="Nutelyt"
              source={logoImage}
              contentFit="contain"
              transition={0}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        </View>

        <View
          className="absolute items-center gap-4"
          style={{ bottom: Math.max(insets.bottom + 44, 64) }}
        >
          <View className="flex-row items-center gap-2 rounded-full bg-[#EEEEF0] px-4 py-2">
            <View className="h-3.5 w-3 rounded-full bg-[#27AE60]" />

            <Text className="text-sm font-semibold tracking-[0.14px] text-muted">
              Powered by Advanced AI
            </Text>
          </View>

          <View className="h-1 w-12 overflow-hidden rounded-full bg-[#E2E2E5]">
            <View className="h-full w-full rounded-full bg-[#27AE60]" />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
