import { featureFlags } from "@/config/feature-flags";
import { historyMockRepository } from "@/features/history/repositories/mock-history.repository";
import { historySnapshotSchema } from "@/features/history/schemas/history.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";

export const historyApi = {
  async getHistory(input: { now: Date; signal?: AbortSignal }) {
    if (featureFlags.enableMockApi) return historyMockRepository.getHistory(input.now);
    const response = await httpClient.get<unknown>("/history", {
      signal: input.signal,
    });

    return parseApiResponse(historySnapshotSchema, response.data);
  },
} as const;
