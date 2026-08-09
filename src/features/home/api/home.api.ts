import { featureFlags } from '@/config/feature-flags';
import { homeMockRepository } from '@/features/home/repositories/mock-home.repository';
import { homeSnapshotSchema } from '@/features/home/schemas/home.schema';
import type { HomeProfileContext } from '@/features/home/home.types';
import { httpClient } from '@/services/http/client';
import { parseApiResponse } from '@/services/http/parse-response';

function unsupportedMutation() {
  throw new Error('Home mutations require the mock repository or an approved backend contract.');
}

export const homeApi = {
  async getSnapshot(input: { now: Date; profile: HomeProfileContext; signal?: AbortSignal }) {
    if (featureFlags.enableMockApi) return homeMockRepository.getSnapshot(input.profile, input.now);
    const response = await httpClient.get<unknown>('/home/recommendations', { signal: input.signal });
    return parseApiResponse(homeSnapshotSchema, response.data);
  },
  async logActivity(input: { caloriesEstimate: number; durationMinutes: number; id: string; now: Date }) {
    if (featureFlags.enableMockApi) return homeMockRepository.logActivity(input, input.now);
    return unsupportedMutation();
  },
  async logMeal(input: { now: Date; recommendationId: string }) {
    if (featureFlags.enableMockApi) return homeMockRepository.logMeal(input.recommendationId, input.now);
    return unsupportedMutation();
  },
  async saveRecommendation(input: { now: Date; recommendationId: string }) {
    if (featureFlags.enableMockApi) return homeMockRepository.saveRecommendation(input.recommendationId, input.now);
    return unsupportedMutation();
  },
  async unsaveRecommendation(input: { recommendationId: string }) {
    if (featureFlags.enableMockApi) return homeMockRepository.unsaveRecommendation(input.recommendationId);
    return unsupportedMutation();
  },
} as const;
