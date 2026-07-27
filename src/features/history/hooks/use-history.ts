import { useQuery } from "@tanstack/react-query";

import { historyApi } from "@/features/history/api/history.api";
import { historyKeys } from "@/features/history/api/history.keys";
import { historyMockRepository } from "@/features/history/repositories/mock-history.repository";

export function useHistory() {
  return useQuery({
    initialData: historyMockRepository.getHistory,
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => historyApi.getHistory(signal),
    queryKey: historyKeys.list(),
  });
}
