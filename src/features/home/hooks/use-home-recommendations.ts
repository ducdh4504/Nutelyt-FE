import { useQuery } from "@tanstack/react-query";

import { homeApi } from "@/features/home/api/home.api";
import { homeKeys } from "@/features/home/api/home.keys";
import { homeMockRepository } from "@/features/home/repositories/mock-home.repository";

export function useHomeRecommendations() {
  return useQuery({
    initialData: homeMockRepository.getRecommendations,
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => homeApi.getRecommendations(signal),
    queryKey: homeKeys.recommendations(),
  });
}
