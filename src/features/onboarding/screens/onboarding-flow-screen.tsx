import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { loginAssets } from "@/features/auth";
import { logger } from "@/services/logger/logger";

import { OnboardingSlideView } from "../components/onboarding-slide";
import {
  ONBOARDING_FONT_FAMILY,
  ONBOARDING_FONTS,
} from "../config/onboarding-fonts";
import { ONBOARDING_SLIDES } from "../config/onboarding-slides";
import { onboardingColors } from "../config/onboarding-theme";
import { useOnboardingActivity } from "../hooks/use-onboarding-activity";
import { useOnboardingFlow } from "../hooks/use-onboarding-flow";

const loginPrefetchUris = loginAssets
  .map((moduleId) => {
    try {
      const asset = Asset.fromModule(moduleId);
      return asset.uri ?? asset.localUri ?? null;
    } catch {
      return null;
    }
  })
  .filter((uri): uri is string => typeof uri === "string" && uri.length > 0);

export function OnboardingFlowScreen() {
  const [fontsLoaded, fontError] = useFonts(ONBOARDING_FONTS);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const transitionProgress = useRef(new Animated.Value(1)).current;
  const {
    activeIndex,
    complete,
    continueToNext,
    direction,
    goBack,
    isCompleting,
    isTransitioning,
    navigationError,
  } = useOnboardingFlow();
  const { isMotionEnabled, shouldReduceMotion } = useOnboardingActivity();
  const slide = ONBOARDING_SLIDES[activeIndex] ?? ONBOARDING_SLIDES[0];
  const isCompact = height - insets.top - insets.bottom < 760;
  const contentWidth = Math.min(Math.max(width - 40, 280), 350);
  const heroWidth = Math.min(contentWidth, isCompact ? 284 : 350);
  const fontFamily = fontsLoaded ? ONBOARDING_FONT_FAMILY : undefined;
  const isDisabled = isTransitioning || isCompleting;

  useEffect(() => {
    if (fontError) {
      logger.warn("Onboarding font failed to load; using system font:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ animated: false, y: 0 });

    if (shouldReduceMotion) {
      transitionProgress.setValue(1);
      return;
    }

    transitionProgress.setValue(0);
    Animated.timing(transitionProgress, {
      duration: 280,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, shouldReduceMotion, transitionProgress]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (activeIndex === 0) {
          return false;
        }

        if (!isDisabled) {
          goBack();
        }
        return true;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [activeIndex, goBack, isDisabled]);

  useEffect(() => {
    if (slide.step !== 3 || loginPrefetchUris.length === 0) {
      return;
    }

    let mounted = true;
    Image.prefetch(loginPrefetchUris, "memory-disk").catch((error) => {
      if (mounted) {
        logger.warn("Preload login assets failed:", error);
      }
    });

    return () => {
      mounted = false;
    };
  }, [slide.step]);

  const animatedContentStyle = {
    opacity: transitionProgress,
    transform: [
      {
        translateX: transitionProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [direction * 18, 0],
        }),
      },
    ],
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: onboardingColors.background,
        paddingTop: insets.top,
      }}
    >
      <StatusBar backgroundColor={onboardingColors.background} style="dark" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingHorizontal: 20,
        }}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View className="flex-1" style={animatedContentStyle}>
          <OnboardingSlideView
            contentWidth={contentWidth}
            disabled={isDisabled}
            fontFamily={fontFamily}
            heroWidth={heroWidth}
            isCompact={isCompact}
            isCompleting={isCompleting}
            isMotionEnabled={isMotionEnabled}
            navigationError={navigationError}
            onBack={goBack}
            onPrimaryAction={continueToNext}
            onSkip={complete}
            slide={slide}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
