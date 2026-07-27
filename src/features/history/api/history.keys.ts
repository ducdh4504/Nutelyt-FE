export const historyKeys = {
  all: ["history"] as const,
  list: () => [...historyKeys.all, "list"] as const,
} as const;
