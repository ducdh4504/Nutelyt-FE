import { useQuery } from "@tanstack/react-query";

import { recipesApi } from "@/features/ai-chat/api/recipes.api";
import { recipeKeys } from "@/features/ai-chat/api/recipes.keys";
import { recipesMockRepository } from "@/features/ai-chat/repositories/mock-recipes.repository";

export function useRecipes() {
  return useQuery({
    initialData: recipesMockRepository.getCatalog,
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => recipesApi.getCatalog(signal),
    queryKey: recipeKeys.catalog(),
  });
}
