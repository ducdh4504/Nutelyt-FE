import { useQuery } from "@tanstack/react-query";

import { foodAnalysisApi } from "@/features/food-analysis/api/food-analysis.api";
import { foodAnalysisKeys } from "@/features/food-analysis/api/food-analysis.keys";
import { foodAnalysisMockRepository } from "@/features/food-analysis/repositories/mock-food-analysis.repository";

export function useFoodAnalysis(foodId?: string) {
  return useQuery({
    initialData: () => foodAnalysisMockRepository.getFood(foodId),
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => foodAnalysisApi.getFood(foodId, signal),
    queryKey: foodAnalysisKeys.detail(foodId),
  });
}
