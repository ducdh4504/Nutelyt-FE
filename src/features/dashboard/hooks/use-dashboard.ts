import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { dashboardKeys } from "@/features/dashboard/api/dashboard.keys";
import { dashboardMockRepository } from "@/features/dashboard/repositories/mock-dashboard.repository";

export function useDashboard() {
  return useQuery({
    initialData: dashboardMockRepository.getDashboard,
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => dashboardApi.getDashboard(signal),
    queryKey: dashboardKeys.summary(),
  });
}
