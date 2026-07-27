import { featureFlags } from "@/config/feature-flags";
import { createFoodAnalysisMockAdapter } from "@/features/food-analysis/repositories/mock-food-analysis.repository";
import { foodAnalysisSchema } from "@/features/food-analysis/schemas/food-analysis.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const foodAnalysisApi = {
  async getFood(foodId?: string, signal?: AbortSignal) {
    const response = await httpClient.get<unknown>(
      `/food-analysis/${foodId ?? "default"}`,
      {
        adapter: featureFlags.enableMockApi
          ? createFoodAnalysisMockAdapter(foodId)
          : undefined,
        signal,
      },
    );

    return parseApiResponse(foodAnalysisSchema, response.data);
  },
} as const;
