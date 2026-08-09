import { homeRuntimeLogSource } from '@/features/home';
import { historySnapshotSchema } from '@/features/history/schemas/history.schema';
import type { HistorySnapshot } from '@/features/history/history.types';

/**
 * Temporary local adapter. It converts the public Home runtime event contract
 * into the History feature contract without duplicating Home fixture data.
 */
export const historyMockRepository = {
  getHistory(now: Date): HistorySnapshot {
    return historySnapshotSchema.parse({
      entries: homeRuntimeLogSource.getRuntimeHistoryEvents(),
      generatedAt: now.toISOString(),
    });
  },
} as const;
