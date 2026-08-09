import { useCallback, useMemo, useRef, useState } from 'react';

import { conversationsApi } from '@/features/ai-chat/api/conversations.api';
import { useConversationActions } from '@/features/ai-chat/hooks/use-conversation-actions';
import { useConversation, useConversationList } from '@/features/ai-chat/hooks/use-conversations';
import type { ChatMessage, ChatProfileContext } from '@/features/ai-chat/ai-chat.types';

type FailedRequest = { id: string; text: string };

function createPendingMessage(conversationId: string, request: FailedRequest): ChatMessage {
  return {
    content: { kind: 'text', text: request.text },
    conversationId,
    createdAt: new Date().toISOString(),
    id: request.id,
    role: 'user',
    status: 'sent',
  };
}

export function useChatWorkspace(profile: ChatProfileContext) {
  const initialConversationId = useRef(conversationsApi.getInitialConversationId()).current;
  const [activeConversationId, setActiveConversationId] = useState(initialConversationId);
  const [pendingRequest, setPendingRequest] = useState<FailedRequest | null>(null);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const actionLocks = useRef(new Set<string>());
  const sendLock = useRef(false);
  const actions = useConversationActions();
  const conversationQuery = useConversation(activeConversationId);
  const listQuery = useConversationList();
  const messages = useMemo(() => {
    const stored = conversationQuery.data?.messages ?? [];
    return pendingRequest ? [...stored, createPendingMessage(activeConversationId, pendingRequest)] : failedRequest ? [...stored, createPendingMessage(activeConversationId, failedRequest)] : stored;
  }, [activeConversationId, conversationQuery.data?.messages, failedRequest, pendingRequest]);

  const submit = useCallback(async (text: string, retry = false) => {
    const trimmed = text.trim();
    if (!trimmed || actions.send.isPending || sendLock.current) return false;
    const request = retry && failedRequest ? failedRequest : { id: `user-message-${Date.now()}`, text: trimmed };
    setPendingRequest(request);
    setFailedRequest(null);
    sendLock.current = true;
    try {
      await actions.send.mutateAsync({ conversationId: activeConversationId, messageId: request.id, now: new Date(), profile, text: request.text });
      return true;
    } catch {
      setFailedRequest(request);
      return false;
    } finally {
      sendLock.current = false;
      setPendingRequest(null);
    }
  }, [actions.send, activeConversationId, failedRequest, profile]);

  const createConversation = useCallback(async () => {
    if (actions.create.isPending) return;
    const conversation = await actions.create.mutateAsync(new Date());
    setPendingRequest(null);
    setFailedRequest(null);
    setActionError(null);
    setActiveConversationId(conversation.id);
  }, [actions.create]);

  const runAction = useCallback(async (id: string, action: () => Promise<unknown>) => {
    if (actionLocks.current.has(id)) return;
    actionLocks.current.add(id);
    setActionError(null);
    try {
      await action();
    } catch {
      setActionError('Không thể cập nhật hoạt động lúc này. Vui lòng thử lại.');
    } finally {
      actionLocks.current.delete(id);
    }
  }, []);

  return {
    actionError,
    activeConversationId,
    conversationQuery,
    createConversation,
    failedRequest,
    isSending: Boolean(pendingRequest),
    listQuery,
    logActivity: (input: { caloriesEstimate: number; durationMinutes: number; id: string; name?: string }) => runAction(`activity:${input.id}`, () => actions.logActivity.mutateAsync({ ...input, now: new Date() })),
    logMeal: (recommendationId: string) => runAction(`meal:${recommendationId}`, () => actions.logMeal.mutateAsync({ now: new Date(), recommendationId })),
    messages,
    retry: () => failedRequest ? submit(failedRequest.text, true) : Promise.resolve(false),
    saveRecipe: (recommendationId: string) => runAction(`save:${recommendationId}`, () => actions.saveRecipe.mutateAsync({ now: new Date(), recommendationId })),
    selectConversation: (id: string) => { setPendingRequest(null); setFailedRequest(null); setActionError(null); setActiveConversationId(id); },
    submit,
  };
}
