import { featureFlags } from "@/config/feature-flags";
import { dashboardMockAdapter } from "@/features/dashboard/repositories/mock-dashboard.repository";
import { dashboardSchema } from "@/features/dashboard/schemas/dashboard.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const dashboardApi = {
  async getDashboard(signal?: AbortSignal) {
    const response = await httpClient.get<unknown>("/dashboard", {
      adapter: featureFlags.enableMockApi ? dashboardMockAdapter : undefined,
      signal,
    });

    return parseApiResponse(dashboardSchema, response.data);
  },
} as const;
