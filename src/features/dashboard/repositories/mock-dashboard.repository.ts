import { dashboardMock } from "@/features/dashboard/data/mock-dashboard";
import { dashboardSchema } from "@/features/dashboard/schemas/dashboard.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";

const dashboardData = dashboardSchema.parse(dashboardMock);

export const dashboardMockRepository = {
  getDashboard: () => dashboardData,
} as const;

export const dashboardMockAdapter = createMockAdapter(
  dashboardMockRepository.getDashboard,
);
