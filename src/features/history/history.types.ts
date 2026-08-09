import type { ImageSource } from 'expo-image';

export type HistoryCategory = 'all' | 'meal' | 'activity' | 'saved';
export type HistoryTimeRange = 'today' | 'last-7-days' | 'last-30-days';

export type HistoryFilters = {
  category: HistoryCategory;
  query: string;
  range: HistoryTimeRange;
};

export type MealHistoryEntry = {
  calories: number;
  id: string;
  image: number | ImageSource;
  kind: 'meal';
  occurredAt: string;
  proteinGrams: number;
  title: string;
};

export type ActivityHistoryEntry = {
  caloriesEstimate: number;
  durationMinutes: number;
  id: string;
  kind: 'activity';
  occurredAt: string;
  title: string;
};

export type SavedHistoryEntry = {
  id: string;
  image: number | ImageSource;
  kind: 'saved';
  occurredAt: string;
  title: string;
};

export type HistoryEntry = MealHistoryEntry | ActivityHistoryEntry | SavedHistoryEntry;

export type HistorySnapshot = {
  entries: HistoryEntry[];
  generatedAt: string;
};

export type HistorySection = {
  data: HistoryEntry[];
  title: string;
};
