export const conversationKeys = {
  all: ['ai-chat'] as const,
  conversation: (id: string) => [...conversationKeys.all, 'conversation', id] as const,
  list: () => [...conversationKeys.all, 'conversations'] as const,
} as const;
