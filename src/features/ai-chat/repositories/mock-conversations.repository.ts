import { conversationListSchema, conversationSchema } from '@/features/ai-chat/schemas/conversations.schema';
import { createMockResponse } from '@/features/ai-chat/repositories/mock-conversation-engine';
import type { ChatMessage, Conversation, ConversationListItem, SendMessageInput, SendMessageResult } from '@/features/ai-chat/ai-chat.types';

const conversations = new Map<string, Conversation>();
let sequence = 0;

function makeId(prefix: string) {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

function titleFromMessage(text: string) {
  const compact = text.replace(/\s+/g, ' ').trim();
  return compact.length > 36 ? `${compact.slice(0, 33)}...` : compact;
}

function pause() {
  return new Promise<void>((resolve) => setTimeout(resolve, 480));
}

function ensureInitialConversation() {
  const existing = [...conversations.values()][0];
  return existing ?? createConversation(new Date());
}

function createConversation(now: Date): Conversation {
  const timestamp = now.toISOString();
  const conversation: Conversation = {
    createdAt: timestamp,
    id: makeId('conversation'),
    messages: [],
    title: 'Cuộc trò chuyện mới',
    updatedAt: timestamp,
  };
  conversations.set(conversation.id, conversation);
  return conversationSchema.parse(conversation);
}

export const mockConversationsRepository = {
  getConversation(id: string) {
    const conversation = conversations.get(id);
    return conversation ? conversationSchema.parse(conversation) : null;
  },

  getInitialConversationId() {
    return ensureInitialConversation().id;
  },

  listConversations(): ConversationListItem[] {
    const items = [...conversations.values()]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map(({ messages: _messages, ...conversation }) => conversation);
    return conversationListSchema.parse(items);
  },

  createConversation(now: Date) {
    return createConversation(now);
  },

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const conversation = conversations.get(input.conversationId);
    if (!conversation) throw new Error('Conversation not found.');
    await pause();
    const responseContent = createMockResponse(input);
    const timestamp = input.now.toISOString();
    const userMessage: ChatMessage = {
      content: { kind: 'text', text: input.text },
      conversationId: conversation.id,
      createdAt: timestamp,
      id: input.messageId,
      role: 'user',
      status: 'sent',
    };
    const assistantMessages: ChatMessage[] = responseContent.map((content) => ({
      content,
      conversationId: conversation.id,
      createdAt: timestamp,
      id: makeId('assistant-message'),
      role: 'assistant',
      status: 'sent',
    }));
    const updated: Conversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage, ...assistantMessages],
      title: conversation.messages.length === 0 ? titleFromMessage(input.text) : conversation.title,
      updatedAt: timestamp,
    };
    conversations.set(updated.id, updated);
    return { conversation: conversationSchema.parse(updated) };
  },
} as const;
