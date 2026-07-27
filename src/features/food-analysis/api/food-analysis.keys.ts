export const foodAnalysisKeys = {
  all: ["food-analysis"] as const,
  detail: (foodId?: string) =>
    [...foodAnalysisKeys.all, "detail", foodId ?? "default"] as const,
} as const;
