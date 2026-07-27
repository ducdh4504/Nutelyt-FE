import { featureFlags } from "@/config/feature-flags";
import { historyMockAdapter } from "@/features/history/repositories/mock-history.repository";
import { historySectionsSchema } from "@/features/history/schemas/history.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const historyApi = {
  async getHistory(signal?: AbortSignal) {
    const response = await httpClient.get<unknown>("/history", {
      adapter: featureFlags.enableMockApi ? historyMockAdapter : undefined,
      signal,
    });

    return parseApiResponse(historySectionsSchema, response.data);
  },
} as const;
