import { featureFlags } from "@/config/feature-flags";
import { recipesMockAdapter } from "@/features/ai-chat/repositories/mock-recipes.repository";
import { recipeCatalogSchema } from "@/features/ai-chat/schemas/recipes.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const recipesApi = {
  async getCatalog(signal?: AbortSignal) {
    const response = await httpClient.get<unknown>("/ai-chat/recipes", {
      adapter: featureFlags.enableMockApi ? recipesMockAdapter : undefined,
      signal,
    });

    return parseApiResponse(recipeCatalogSchema, response.data);
  },
} as const;
