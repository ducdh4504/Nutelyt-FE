import { useQuery } from '@tanstack/react-query';

import { conversationsApi } from '@/features/ai-chat/api/conversations.api';
import { conversationKeys } from '@/features/ai-chat/api/conversations.keys';

export function useConversation(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => conversationsApi.getConversation(id),
    queryKey: conversationKeys.conversation(id),
  });
}

export function useConversationList() {
  return useQuery({
    queryFn: conversationsApi.listConversations,
    queryKey: conversationKeys.list(),
  });
}
