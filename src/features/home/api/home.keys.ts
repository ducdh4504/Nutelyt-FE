export const homeKeys = {
  all: ["home"] as const,
  recommendations: () => [...homeKeys.all, "recommendations"] as const,
} as const;
