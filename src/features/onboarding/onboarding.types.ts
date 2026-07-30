import type { ImageSourcePropType } from "react-native";

export type OnboardingSlideId =
  | "personalized-support"
  | "meal-timing"
  | "weekly-progress";

export type OnboardingBadge =
  | {
      kind: "personalization" | "low-carb" | "high-protein";
      label: string;
    }
  | {
      kind: "weight";
      label: string;
      value: string;
    }
  | {
      kind: "calories";
      label: string;
      progress: number;
    }
  | {
      completedDays: number;
      kind: "weekly-progress";
      label: string;
      totalDays: number;
    };

export type OnboardingSlide = Readonly<{
  accessibility: Readonly<{
    backLabel: string;
    primaryActionLabel: string;
    progressLabel: string;
    skipLabel?: string;
  }>;
  description: string;
  eyebrow?: string;
  id: OnboardingSlideId;
  primaryActionLabel: string;
  showsBack: boolean;
  showsSkip: boolean;
  step: 1 | 2 | 3;
  title: string;
  visual: Readonly<{
    asset: ImageSourcePropType;
    badges: readonly OnboardingBadge[];
  }>;
}>;
