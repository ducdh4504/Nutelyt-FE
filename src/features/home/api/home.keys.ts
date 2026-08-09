export const homeKeys = {
  all: ['home'] as const,
  snapshot: (localDate: string, mealPeriod: string) => [...homeKeys.all, 'snapshot', localDate, mealPeriod] as const,
} as const;
