import { mockFoods } from "@/features/food-analysis/data/mock-foods";
import {
  foodAnalysesSchema,
  foodAnalysisSchema,
} from "@/features/food-analysis/schemas/food-analysis.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";

const foods = foodAnalysesSchema.parse(mockFoods);

function getFood(foodId?: string) {
  const food = foods.find((item) => item.id === foodId) ?? foods[0];
  return foodAnalysisSchema.parse(food);
}

export const foodAnalysisMockRepository = {
  getFood,
} as const;

export function createFoodAnalysisMockAdapter(foodId?: string) {
  return createMockAdapter(() => foodAnalysisMockRepository.getFood(foodId));
}
