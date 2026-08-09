export const historyKeys = {
  all: ["history"] as const,
  snapshot: (localDate: string) => [...historyKeys.all, "snapshot", localDate] as const,
} as const;
