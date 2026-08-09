import { featureFlags } from '@/config/feature-flags';
import { homeRuntimeLogSource } from '@/features/home';

import { mockConversationsRepository } from '@/features/ai-chat/repositories/mock-conversations.repository';
import type { SendMessageInput } from '@/features/ai-chat/ai-chat.types';

function unavailableBackend(): never {
  throw new Error('Conversation actions require an approved backend contract when mock mode is disabled.');
}

export const conversationsApi = {
  getInitialConversationId() {
    if (featureFlags.enableMockApi) return mockConversationsRepository.getInitialConversationId();
    return unavailableBackend();
  },
  getConversation(id: string) {
    if (featureFlags.enableMockApi) return mockConversationsRepository.getConversation(id);
    return unavailableBackend();
  },
  listConversations() {
    if (featureFlags.enableMockApi) return mockConversationsRepository.listConversations();
    return unavailableBackend();
  },
  async createConversation(now: Date) {
    if (featureFlags.enableMockApi) return mockConversationsRepository.createConversation(now);
    return unavailableBackend();
  },
  async sendMessage(input: SendMessageInput) {
    if (featureFlags.enableMockApi) return mockConversationsRepository.sendMessage(input);
    return unavailableBackend();
  },
  async saveRecipe(input: { now: Date; recommendationId: string }) {
    if (featureFlags.enableMockApi) return homeRuntimeLogSource.saveRecommendation(input.recommendationId, input.now);
    return unavailableBackend();
  },
  async logMeal(input: { now: Date; recommendationId: string }) {
    if (featureFlags.enableMockApi) return homeRuntimeLogSource.logMeal(input.recommendationId, input.now);
    return unavailableBackend();
  },
  async logActivity(input: { caloriesEstimate: number; durationMinutes: number; id: string; name?: string; now: Date }) {
    if (featureFlags.enableMockApi) return homeRuntimeLogSource.logActivity(input, input.now);
    return unavailableBackend();
  },
} as const;
