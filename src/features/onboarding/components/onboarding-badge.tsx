import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Platform, Text, View } from "react-native";

import type { OnboardingBadge } from "../onboarding.types";
import { onboardingColors } from "../config/onboarding-theme";

type OnboardingBadgeProps = {
  badge: OnboardingBadge;
  fontFamily?: string;
};

const cardShadow = Platform.select({
  default: {
    elevation: 4,
    shadowColor: "#1A2F20",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
  },
  web: { boxShadow: "0 3px 14px rgba(26, 47, 32, 0.13)" },
});

export function OnboardingBadgeView({
  badge,
  fontFamily,
}: OnboardingBadgeProps) {
  if (badge.kind === "personalization") {
    return (
      <View
        className="h-[46px] w-[138px] flex-row items-center rounded-2xl bg-white px-3"
        style={cardShadow}
      >
        <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-[#EAF8EF]">
          <MaterialIcons color={onboardingColors.primary} name="favorite" size={16} />
        </View>
        <View>
          <Text
            style={{
              color: onboardingColors.foreground,
              fontFamily,
              fontSize: 12,
              fontWeight: "700",
              lineHeight: 15,
            }}
          >
            {badge.label}
          </Text>
          <Text
            style={{
              color: onboardingColors.primary,
              fontFamily,
              fontSize: 10,
              fontWeight: "600",
              lineHeight: 13,
            }}
          >
            Dành riêng cho bạn
          </Text>
        </View>
      </View>
    );
  }

  if (badge.kind === "low-carb" || badge.kind === "high-protein") {
    const isCarb = badge.kind === "low-carb";

    return (
      <View
        className="h-12 flex-row items-center rounded-2xl bg-white px-3"
        style={[cardShadow, { minWidth: isCarb ? 112 : 128 }]}
      >
        <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-[#EAF8EF]">
          <MaterialIcons
            color={onboardingColors.primary}
            name={isCarb ? "restaurant" : "bolt"}
            size={16}
          />
        </View>
        <Text
          style={{
            color: onboardingColors.secondaryText,
            fontFamily,
            fontSize: 13,
            fontWeight: "700",
          }}
        >
          {badge.label}
        </Text>
      </View>
    );
  }

  if (badge.kind === "weight") {
    return (
      <View className="h-[70px] w-[116px] rounded-2xl bg-white px-3 py-2" style={cardShadow}>
        <View className="flex-row items-center">
          <MaterialIcons color={onboardingColors.primary} name="trending-down" size={16} />
          <Text
            className="ml-1"
            style={{
              color: onboardingColors.muted,
              fontFamily,
              fontSize: 10,
              fontWeight: "600",
            }}
          >
            {badge.label}
          </Text>
        </View>
        <Text
          className="mt-1"
          style={{
            color: onboardingColors.foreground,
            fontFamily,
            fontSize: 18,
            fontWeight: "800",
          }}
        >
          {badge.value}
        </Text>
      </View>
    );
  }

  if (badge.kind === "calories") {
    return (
      <View
        className="h-[86px] w-[104px] items-center justify-center rounded-2xl bg-white"
        style={cardShadow}
      >
        <View
          className="h-11 w-11 items-center justify-center rounded-full border-[5px]"
          style={{
            borderColor: onboardingColors.primary,
            borderRightColor: onboardingColors.primaryTrack,
          }}
        >
          <MaterialIcons color={onboardingColors.primary} name="bolt" size={20} />
        </View>
        <Text
          className="mt-1"
          style={{
            color: onboardingColors.secondaryText,
            fontFamily,
            fontSize: 10,
            fontWeight: "700",
          }}
        >
          {Math.round(badge.progress * 100)}% {badge.label}
        </Text>
      </View>
    );
  }

  if (badge.kind !== "weekly-progress") {
    return null;
  }

  return (
    <View className="h-[72px] w-[140px] rounded-2xl bg-white px-3 py-2" style={cardShadow}>
      <Text
        style={{
          color: onboardingColors.secondaryText,
          fontFamily,
          fontSize: 10,
          fontWeight: "700",
        }}
      >
        {badge.label}
      </Text>
      <View className="mt-2 flex-row justify-between">
        {Array.from({ length: badge.totalDays }, (_, index) => {
          const isComplete = index < badge.completedDays;

          return (
            <View
              className="h-3.5 w-3.5 items-center justify-center rounded-full"
              key={index}
              style={{
                backgroundColor: isComplete
                  ? onboardingColors.primary
                  : onboardingColors.primaryTrack,
              }}
            >
              {isComplete ? (
                <MaterialIcons color={onboardingColors.white} name="check" size={9} />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
