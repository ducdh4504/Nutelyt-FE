import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { onboardingColors } from "../config/onboarding-theme";
import { onboardingImages } from "../data/onboarding-assets";

type OnboardingHeaderProps = {
  backAccessibilityLabel: string;
  onBack: () => void;
  showsBack: boolean;
  step: 1 | 2 | 3;
};

export function OnboardingHeader({
  backAccessibilityLabel,
  onBack,
  showsBack,
  step,
}: OnboardingHeaderProps) {
  const logoWidth = step === 1 ? 156 : 132;
  const logoHeight = step === 1 ? 44 : 37;

  return (
    <View className="h-16 w-full flex-row items-center justify-center">
      {showsBack ? (
        <Pressable
          accessibilityLabel={backAccessibilityLabel}
          accessibilityRole="button"
          className="absolute left-0 h-12 w-12 items-center justify-center rounded-full"
          hitSlop={4}
          onPress={onBack}
        >
          <MaterialIcons
            color={onboardingColors.foreground}
            name="arrow-back"
            size={20}
          />
        </Pressable>
      ) : null}

      <Image
        accessibilityLabel="Nutelyt"
        contentFit="contain"
        source={onboardingImages.logo}
        style={{ height: logoHeight, width: logoWidth }}
        transition={0}
      />
    </View>
  );
}

