import type { ImageSource } from 'expo-image';

export type DashboardMacro = {
  id: 'carb' | 'protein' | 'fat';
  label: string;
  value: string;
  color: string;
};

export type DashboardChartDay = {
  day: string;
  carb: number;
  protein: number;
  fat: number;
};

export type DashboardWarning = {
  id: 'sodium' | 'protein';
  title: string;
  message: string;
  tone: 'danger' | 'warning';
};

export type DashboardFoodEntry = {
  id: string;
  day: string;
  date: string;
  title: string;
  image: number | ImageSource;
  tags: { label: string; tone: 'danger' | 'success' | 'neutral' }[];
  suggestion: string;
};
