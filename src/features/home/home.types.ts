import type { ImageSource } from 'expo-image';

import type { DietPreference } from '@/features/health-profile';

export type MealPeriod = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'outside-meal-window';

export type NutritionSummary = {
  calories: number;
  proteinGrams: number;
};

export type MealRecommendation = {
  allergens: string[];
  description: string;
  id: string;
  image: number | ImageSource;
  isLogged: boolean;
  isSaved: boolean;
  name: string;
  nutrition: NutritionSummary;
  periods: MealPeriod[];
  supportedDiets: DietPreference[];
  tags: string[];
};

export type ActivitySuggestion = {
  caloriesEstimate: number;
  durationMinutes: number;
  id: string;
  isLogged: boolean;
  name: string;
};

export type DailyProgress = {
  activityMinutes: number;
  mealGoal: number;
  mealsLogged: number;
};

export type CompanionPrompt = {
  body: string;
  title: string;
};

export type HomeSnapshot = {
  activitySuggestion: ActivitySuggestion | null;
  companionPrompt: CompanionPrompt;
  dailyProgress: DailyProgress;
  generatedAt: string;
  greeting: string;
  localDate: string;
  mealPeriod: MealPeriod;
  periodTitle: string;
  recommendations: MealRecommendation[];
};

export type HomeProfileContext = {
  allergies: string[];
  diet: DietPreference | null;
  displayName: string;
};

export type MealLog = {
  consumedAt: string;
  nutrition: NutritionSummary;
  recommendationId: string;
  stableId: string;
};

export type ActivityLog = {
  activityId: string;
  caloriesEstimate: number;
  completedAt: string;
  durationMinutes: number;
  name?: string;
  stableId: string;
};

/**
 * Public projection of the confirmed Home runtime actions. Other features
 * consume this contract instead of reaching into Home mock arrays or stores.
 */
export type HomeRuntimeHistoryEvent =
  | {
      calories: number;
      id: string;
      image: number | ImageSource;
      kind: 'meal';
      occurredAt: string;
      proteinGrams: number;
      title: string;
    }
  | {
      caloriesEstimate: number;
      durationMinutes: number;
      id: string;
      kind: 'activity';
      occurredAt: string;
      title: string;
    }
  | {
      id: string;
      image: number | ImageSource;
      kind: 'saved';
      occurredAt: string;
      title: string;
    };
