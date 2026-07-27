import { foodRecommendations } from "@/features/home/data/mock-home";
import { foodRecommendationsSchema } from "@/features/home/schemas/home.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";

const recommendations = foodRecommendationsSchema.parse(foodRecommendations);

export const homeMockRepository = {
  getRecommendations: () => recommendations,
} as const;

export const homeRecommendationsMockAdapter = createMockAdapter(
  homeMockRepository.getRecommendations,
);
