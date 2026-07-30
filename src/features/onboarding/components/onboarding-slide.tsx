import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Platform, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui";

import type { OnboardingSlide } from "../onboarding.types";
import { onboardingColors } from "../config/onboarding-theme";
import { onboardingImages } from "../data/onboarding-assets";
import { OnboardingHeader } from "./onboarding-header";
import { OnboardingHero } from "./onboarding-hero";
import { OnboardingProgress } from "./onboarding-progress";

type OnboardingSlideViewProps = {
  contentWidth: number;
  disabled: boolean;
  fontFamily?: string;
  heroWidth: number;
  isCompact: boolean;
  isCompleting: boolean;
  isMotionEnabled: boolean;
  navigationError: string | null;
  onBack: () => void;
  onPrimaryAction: () => void;
  onSkip: () => void;
  slide: OnboardingSlide;
};

export function OnboardingSlideView({
  contentWidth,
  disabled,
  fontFamily,
  heroWidth,
  isCompact,
  isCompleting,
  isMotionEnabled,
  navigationError,
  onBack,
  onPrimaryAction,
  onSkip,
  slide,
}: OnboardingSlideViewProps) {
  const isFirst = slide.step === 1;
  const isSecond = slide.step === 2;
  const primaryWidth = isSecond ? Math.min(contentWidth, 310) : contentWidth;

  return (
    <View className="flex-1 items-center">
      <View style={{ width: contentWidth }}>
        <OnboardingHeader
          backAccessibilityLabel={slide.accessibility.backLabel}
          onBack={onBack}
          showsBack={slide.showsBack}
          step={slide.step}
        />
      </View>

      <View style={{ marginTop: isCompact ? 0 : isFirst ? 2 : 8 }}>
        <OnboardingHero
          fontFamily={fontFamily}
          isMotionEnabled={isMotionEnabled}
          slide={slide}
          width={heroWidth}
        />
      </View>

      <View
        className={isFirst ? "items-start" : "items-center"}
        style={{
          marginTop: isCompact ? 8 : isFirst ? 12 : 18,
          width: contentWidth,
        }}
      >
        {slide.eyebrow ? (
          <Text
            maxFontSizeMultiplier={1.25}
            style={{
              color: onboardingColors.primary,
              fontFamily,
              fontSize: 13,
              fontWeight: "800",
              letterSpacing: 1.25,
              lineHeight: 18,
            }}
          >
            {slide.eyebrow}
          </Text>
        ) : null}

        <Text
          accessibilityRole="header"
          className={isFirst ? "text-left" : "text-center"}
          maxFontSizeMultiplier={1.25}
          style={{
            color: onboardingColors.foreground,
            fontFamily,
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.45,
            lineHeight: slide.step === 3 ? 35 : 36,
            marginTop: slide.eyebrow ? 10 : 0,
          }}
        >
          {slide.title}
        </Text>

        <Text
          className={isFirst ? "text-left" : "text-center"}
          maxFontSizeMultiplier={1.3}
          style={{
            color: onboardingColors.secondaryText,
            fontFamily,
            fontSize: isFirst ? 18 : 16,
            fontWeight: "400",
            lineHeight: isFirst ? 29.25 : 24,
            marginTop: isCompact ? 8 : 12,
          }}
        >
          {slide.description}
        </Text>
      </View>

      <View style={{ marginTop: isCompact ? 14 : 22 }}>
        <OnboardingProgress
          accessibilityLabel={slide.accessibility.progressLabel}
          fontFamily={fontFamily}
          step={slide.step}
        />
      </View>

      {navigationError ? (
        <Text
          accessibilityLiveRegion="polite"
          className="mt-2 text-center"
          maxFontSizeMultiplier={1.25}
          style={{
            color: "#B3261E",
            fontFamily,
            fontSize: 13,
            lineHeight: 18,
            width: contentWidth,
          }}
        >
          {navigationError}
        </Text>
      ) : null}

      <Button
        accessibilityLabel={slide.accessibility.primaryActionLabel}
        className="border-0"
        disabled={disabled}
        loading={isCompleting}
        onPress={onPrimaryAction}
        style={{
          backgroundColor: onboardingColors.primary,
          borderRadius: isSecond ? 16 : 24,
          height: slide.step === 3 ? 56 : 60,
          marginTop: isCompact ? 14 : 22,
          width: primaryWidth,
        }}
      >
        <View className="flex-row items-center justify-center gap-2">
          <Text
            maxFontSizeMultiplier={1.2}
            style={{
              color: onboardingColors.white,
              fontFamily,
              fontSize: 16,
              fontWeight: "700",
              lineHeight: 22,
            }}
          >
            {slide.primaryActionLabel}
          </Text>
          <MaterialIcons color={onboardingColors.white} name="arrow-forward" size={20} />
        </View>
      </Button>

      {slide.showsSkip ? (
        <Pressable
          accessibilityLabel={slide.accessibility.skipLabel}
          accessibilityRole="button"
          className="h-[52px] items-center justify-center"
          disabled={disabled}
          hitSlop={2}
          onPress={onSkip}
          style={{ width: contentWidth }}
        >
          <Text
            maxFontSizeMultiplier={1.25}
            style={{
              color: isFirst ? onboardingColors.primary : onboardingColors.muted,
              fontFamily,
              fontSize: 14,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            Bỏ qua
          </Text>
        </Pressable>
      ) : (
        <View className="h-5" />
      )}

      {isSecond ? (
        <View
          accessibilityElementsHidden
          className="absolute bottom-[88px] right-[-4px] h-14 w-14 items-center justify-center rounded-full bg-white"
          importantForAccessibility="no-hide-descendants"
          style={[
            { pointerEvents: "none" },
            Platform.select({
              default: {
                elevation: 5,
                shadowColor: "#1A2F20",
                shadowOffset: { height: 3, width: 0 },
                shadowOpacity: 0.14,
                shadowRadius: 8,
              },
              web: { boxShadow: "0 3px 16px rgba(26, 47, 32, 0.14)" },
            }),
          ]}
        >
          <Image
            contentFit="contain"
            source={onboardingImages.mascot}
            style={{ height: 42, width: 42 }}
            transition={0}
          />
        </View>
      ) : null}
    </View>
  );
}
