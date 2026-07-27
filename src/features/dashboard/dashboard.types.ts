import type { z } from "zod";

import type { dashboardSchema } from "@/features/dashboard/schemas/dashboard.schema";

export type DashboardData = z.infer<typeof dashboardSchema>;
export type DashboardMacro = DashboardData["macros"][number];
export type DashboardChartDay = DashboardData["chart"][number];
export type DashboardWarning = DashboardData["warnings"][number];
export type DashboardFoodEntry = DashboardData["diary"][number];
