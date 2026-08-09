import type { ImageSource } from 'expo-image';
import { z } from 'zod';

import type { Conversation, ConversationListItem } from '@/features/ai-chat/ai-chat.types';
import { isImageSource } from '@/utils/image-source';

const imageSchema = z.custom<number | ImageSource>(isImageSource, 'Invalid image source');
const contentSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('text'), text: z.string() }),
  z.object({ calories: z.number().nonnegative(), description: z.string(), image: imageSchema, kind: z.literal('recipe-recommendation'), personalizationNote: z.string(), proteinGrams: z.number().nonnegative(), recommendationId: z.string(), tags: z.array(z.string()), title: z.string(), warning: z.string() }),
  z.object({ calories: z.number().nonnegative(), cautions: z.array(z.string()), image: imageSchema, kind: z.literal('food-analysis'), portion: z.string(), proteinGrams: z.number().nonnegative(), recommendationId: z.string(), strengths: z.array(z.string()), suitability: z.enum(['suitable-with-notes', 'less-suitable']), title: z.string() }),
  z.object({ caloriesEstimate: z.number().nonnegative(), durationMinutes: z.number().positive(), id: z.string(), instructions: z.string(), intensity: z.literal('light'), kind: z.literal('activity-suggestion'), title: z.string() }),
]);

export const conversationSchema: z.ZodType<Conversation> = z.object({
  createdAt: z.string().datetime(),
  id: z.string(),
  messages: z.array(z.object({ content: contentSchema, conversationId: z.string(), createdAt: z.string().datetime(), id: z.string(), role: z.enum(['user', 'assistant']), status: z.enum(['sent', 'failed']) })),
  title: z.string(),
  updatedAt: z.string().datetime(),
});

export const conversationListSchema: z.ZodType<ConversationListItem[]> = z.array(conversationSchema.transform(({ messages: _messages, ...item }) => item));
