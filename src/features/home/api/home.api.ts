import { featureFlags } from "@/config/feature-flags";
import { homeRecommendationsMockAdapter } from "@/features/home/repositories/mock-home.repository";
import { foodRecommendationsSchema } from "@/features/home/schemas/home.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const homeApi = {
  async getRecommendations(signal?: AbortSignal) {
    const response = await httpClient.get<unknown>("/home/recommendations", {
      adapter: featureFlags.enableMockApi
        ? homeRecommendationsMockAdapter
        : undefined,
      signal,
    });

    return parseApiResponse(foodRecommendationsSchema, response.data);
  },
} as const;
