import { useMutation, useQueryClient } from '@tanstack/react-query';

import { conversationsApi } from '@/features/ai-chat/api/conversations.api';
import { conversationKeys } from '@/features/ai-chat/api/conversations.keys';
import type { SendMessageInput } from '@/features/ai-chat/ai-chat.types';

export function useConversationActions() {
  const queryClient = useQueryClient();
  const refreshEvents = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ['history'] }),
    queryClient.invalidateQueries({ queryKey: ['home', 'snapshot'] }),
  ]);
  const send = useMutation({
    mutationFn: (input: SendMessageInput) => conversationsApi.sendMessage(input),
    onSuccess: (result) => {
      queryClient.setQueryData(conversationKeys.conversation(result.conversation.id), result.conversation);
      return queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
  const create = useMutation({
    mutationFn: (now: Date) => conversationsApi.createConversation(now),
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationKeys.conversation(conversation.id), conversation);
      return queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
  const saveRecipe = useMutation({ mutationFn: conversationsApi.saveRecipe, onSuccess: refreshEvents });
  const logMeal = useMutation({ mutationFn: conversationsApi.logMeal, onSuccess: refreshEvents });
  const logActivity = useMutation({ mutationFn: conversationsApi.logActivity, onSuccess: refreshEvents });
  return { create, logActivity, logMeal, saveRecipe, send };
}
