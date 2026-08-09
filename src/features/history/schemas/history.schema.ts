import type { ImageSource } from 'expo-image';
import { z } from 'zod';

import type { HistoryEntry, HistorySnapshot } from '@/features/history/history.types';
import { isImageSource } from '@/utils/image-source';

const imageSchema = z.custom<number | ImageSource>(isImageSource, 'Invalid image source');

const historyEntrySchema: z.ZodType<HistoryEntry> = z.discriminatedUnion('kind', [
  z.object({
    calories: z.number().nonnegative(),
    id: z.string(),
    image: imageSchema,
    kind: z.literal('meal'),
    occurredAt: z.string().datetime(),
    proteinGrams: z.number().nonnegative(),
    title: z.string(),
  }),
  z.object({
    caloriesEstimate: z.number().nonnegative(),
    durationMinutes: z.number().positive(),
    id: z.string(),
    kind: z.literal('activity'),
    occurredAt: z.string().datetime(),
    title: z.string(),
  }),
  z.object({
    id: z.string(),
    image: imageSchema,
    kind: z.literal('saved'),
    occurredAt: z.string().datetime(),
    title: z.string(),
  }),
]);

export const historySnapshotSchema: z.ZodType<HistorySnapshot> = z.object({
  entries: z.array(historyEntrySchema),
  generatedAt: z.string().datetime(),
});
