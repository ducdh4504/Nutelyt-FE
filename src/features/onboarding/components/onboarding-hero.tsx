import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import type { OnboardingSlide } from "../onboarding.types";
import { onboardingColors } from "../config/onboarding-theme";
import { OnboardingBadgeView } from "./onboarding-badge";

type OnboardingHeroProps = {
  fontFamily?: string;
  isMotionEnabled: boolean;
  slide: OnboardingSlide;
  width: number;
};

type BadgePosition = {
  left?: number;
  rotate?: string;
  right?: number;
  top: number;
};

const BADGE_POSITIONS: Record<OnboardingSlide["id"], readonly BadgePosition[]> = {
  "personalized-support": [{ right: 0, rotate: "4deg", top: 6 }],
  "meal-timing": [
    { right: 13, rotate: "5deg", top: 17 },
    { left: 0, rotate: "-5deg", top: 245 },
  ],
  "weekly-progress": [
    { right: 8, rotate: "5deg", top: 0 },
    { left: 0, rotate: "-4deg", top: 181 },
    { right: 12, rotate: "3deg", top: 275 },
  ],
};

export function OnboardingHero({
  fontFamily,
  isMotionEnabled,
  slide,
  width,
}: OnboardingHeroProps) {
  const [assetFailed, setAssetFailed] = useState(false);
  const entry = useSharedValue(isMotionEnabled ? 0 : 1);
  const float = useSharedValue(0);
  const enteredSlideId = useRef<OnboardingSlide["id"] | null>(null);
  const canvasHeight = slide.step === 3 ? 350 : 320;
  const scale = width / 350;

  useEffect(() => {
    if (enteredSlideId.current === slide.id) {
      return;
    }

    enteredSlideId.current = slide.id;
    setAssetFailed(false);
    entry.value = isMotionEnabled
      ? withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })
      : 1;
  }, [entry, isMotionEnabled, slide.id]);

  useEffect(() => {
    cancelAnimation(float);

    if (isMotionEnabled) {
      float.value = withDelay(
        520,
        withRepeat(
          withTiming(1, {
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true,
        ),
      );
    } else {
      float.value = 0;
    }

    return () => {
      cancelAnimation(float);
    };
  }, [float, isMotionEnabled, slide.id]);

  const mascotStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [
      { translateY: (1 - entry.value) * 18 + float.value * -4 },
      { scale: 0.92 + entry.value * 0.08 },
    ],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [
      { translateY: (1 - entry.value) * 12 + float.value * 5 },
      { scale: 0.9 + entry.value * 0.1 },
    ],
  }));

  const mascotSize = slide.step === 1 ? 320 : slide.step === 2 ? 288 : 192;
  const mascotLeft = slide.step === 1 ? 15 : slide.step === 2 ? 31 : 79;
  const mascotTop = slide.step === 1 ? 0 : slide.step === 2 ? 32 : 75;
  const glowSize = slide.step === 1 ? 256 : slide.step === 2 ? 317 : 315;
  const glowLeft = slide.step === 1 ? 47 : slide.step === 2 ? 16 : 18;
  const glowTop = slide.step === 1 ? 32 : slide.step === 2 ? 18 : 18;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ height: canvasHeight * scale, pointerEvents: "none", width }}
    >
      <View
        className="absolute"
        style={{
          height: canvasHeight,
          left: (width - 350) / 2,
          top: (canvasHeight * scale - canvasHeight) / 2,
          transform: [{ scale }],
          width: 350,
        }}
      >
        <View
          className="absolute rounded-full"
          style={{
            backgroundColor: onboardingColors.glow,
            height: glowSize,
            left: glowLeft,
            opacity: 0.18,
            top: glowTop,
            width: glowSize,
          }}
        />

        <Animated.View
          className="absolute items-center justify-center"
          style={[
            mascotStyle,
            {
              height: mascotSize,
              left: mascotLeft,
              top: mascotTop,
              width: mascotSize,
            },
          ]}
        >
          {assetFailed ? (
            <View
              className="h-28 w-28 items-center justify-center rounded-full"
              style={{ backgroundColor: onboardingColors.primaryTrack }}
            >
              <MaterialIcons color={onboardingColors.primary} name="smart-toy" size={58} />
            </View>
          ) : (
            <Image
              accessibilityIgnoresInvertColors
              contentFit="contain"
              onError={() => setAssetFailed(true)}
              source={slide.visual.asset}
              style={{ height: "100%", width: "100%" }}
              transition={0}
            />
          )}
        </Animated.View>

        {slide.visual.badges.map((badge, index) => {
          const position = BADGE_POSITIONS[slide.id][index];

          return (
            <View
              key={`${slide.id}-${badge.kind}`}
              style={{
                left: position.left,
                position: "absolute",
                right: position.right,
                top: position.top,
                transform: [{ rotate: position.rotate ?? "0deg" }],
              }}
            >
              <Animated.View style={badgeStyle}>
                <OnboardingBadgeView badge={badge} fontFamily={fontFamily} />
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
