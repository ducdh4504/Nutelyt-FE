import type { OnboardingSlide } from "@/features/onboarding/onboarding.types";

import { onboardingImages } from "../data/onboarding-assets";

export const ONBOARDING_SLIDES = [
  {
    accessibility: {
      backLabel: "Quay lại bước trước",
      primaryActionLabel: "Tiếp tục đến bước 2",
      progressLabel: "Bước 1 trên 3",
      skipLabel: "Bỏ qua giới thiệu và đến màn hình đăng nhập",
    },
    description:
      "Nutelyt cá nhân hóa hành trình của bạn dựa trên chỉ số cơ thể, sở thích ăn uống và thói quen sinh hoạt hàng ngày.",
    eyebrow: "HÀNH TRÌNH MỚI",
    id: "personalized-support",
    primaryActionLabel: "Tiếp tục",
    showsBack: false,
    showsSkip: true,
    step: 1,
    title: "Giảm cân theo cách phù hợp với bạn",
    visual: {
      asset: onboardingImages.mascot,
      badges: [{ kind: "personalization", label: "Cá nhân hóa" }],
    },
  },
  {
    accessibility: {
      backLabel: "Quay lại bước 1",
      primaryActionLabel: "Tiếp tục đến bước 3",
      progressLabel: "Bước 2 trên 3",
      skipLabel: "Bỏ qua giới thiệu và đến màn hình đăng nhập",
    },
    description:
      "Nhận gợi ý bữa ăn và hoạt động nhẹ nhàng phù hợp với từng thời điểm trong ngày của bạn.",
    id: "meal-timing",
    primaryActionLabel: "Tiếp tục",
    showsBack: true,
    showsSkip: true,
    step: 2,
    title: "Ăn uống đúng lúc, lựa chọn dễ dàng hơn",
    visual: {
      asset: onboardingImages.mascot,
      badges: [
        { kind: "low-carb", label: "Ít Carb" },
        { kind: "high-protein", label: "Giàu Đạm" },
      ],
    },
  },
  {
    accessibility: {
      backLabel: "Quay lại bước 2",
      primaryActionLabel: "Bắt đầu và đến màn hình đăng nhập",
      progressLabel: "Bước 3 trên 3",
    },
    description:
      "Mọi bữa ăn, hoạt động và cân nặng của bạn đều được tổng hợp thành bảng Dashboard trực quan mỗi tuần.",
    id: "weekly-progress",
    primaryActionLabel: "Bắt đầu ngay",
    showsBack: true,
    showsSkip: false,
    step: 3,
    title: "Nhìn lại tiến trình sau mỗi 7 ngày",
    visual: {
      asset: onboardingImages.mascot,
      badges: [
        { kind: "weight", label: "Cân nặng", value: "-1.5 kg" },
        { kind: "calories", label: "Calories", progress: 0.75 },
        {
          completedDays: 6,
          kind: "weekly-progress",
          label: "Tiến độ tuần",
          totalDays: 7,
        },
      ],
    },
  },
] as const satisfies readonly OnboardingSlide[];

export const ONBOARDING_SLIDE_COUNT = ONBOARDING_SLIDES.length;
