import {
  alternateMealSuggestionRecipeIds,
  firstMealSuggestionRecipeIds,
  mockRecipes,
} from "@/features/ai-chat/data/mock-recipes";
import { recipeCatalogSchema } from "@/features/ai-chat/schemas/recipes.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";

const recipeCatalog = recipeCatalogSchema.parse({
  alternateMealSuggestionRecipeIds,
  firstMealSuggestionRecipeIds,
  recipes: mockRecipes,
});

export const recipesMockRepository = {
  getCatalog: () => recipeCatalog,
} as const;

export const recipesMockAdapter = createMockAdapter(
  recipesMockRepository.getCatalog,
);
