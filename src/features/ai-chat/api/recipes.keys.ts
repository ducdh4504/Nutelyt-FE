export const recipeKeys = {
  all: ["ai-chat", "recipes"] as const,
  catalog: () => [...recipeKeys.all, "catalog"] as const,
} as const;
