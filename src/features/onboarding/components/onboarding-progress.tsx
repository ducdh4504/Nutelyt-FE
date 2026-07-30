import { Text, View } from "react-native";

import { ONBOARDING_SLIDE_COUNT } from "../config/onboarding-slides";
import { onboardingColors } from "../config/onboarding-theme";

type OnboardingProgressProps = {
  accessibilityLabel: string;
  fontFamily?: string;
  step: 1 | 2 | 3;
};

export function OnboardingProgress({
  accessibilityLabel,
  fontFamily,
  step,
}: OnboardingProgressProps) {
  const width = step === 1 ? 120 : 96;
  const height = step === 1 ? 6 : 8;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{
        max: ONBOARDING_SLIDE_COUNT,
        min: 1,
        now: step,
        text: accessibilityLabel,
      }}
      className="items-center gap-2"
    >
      <View
        className="overflow-hidden rounded-full"
        style={{
          backgroundColor: onboardingColors.primaryTrack,
          height,
          width,
        }}
      >
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: onboardingColors.primary,
            width: `${(step / ONBOARDING_SLIDE_COUNT) * 100}%`,
          }}
        />
      </View>
      <Text
        style={{
          color: onboardingColors.muted,
          fontFamily,
          fontSize: 12,
          fontWeight: "600",
          lineHeight: 16,
        }}
      >
        {step} / {ONBOARDING_SLIDE_COUNT}
      </Text>
    </View>
  );
}
