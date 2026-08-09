import type { ImageSource } from 'expo-image';
import { z } from 'zod';

import type { HomeSnapshot, MealRecommendation } from '@/features/home/home.types';
import { isImageSource } from '@/utils/image-source';

const imageSchema = z.custom<number | ImageSource>(isImageSource, 'Invalid image source');
const mealPeriodSchema = z.enum(['breakfast', 'lunch', 'snack', 'dinner', 'outside-meal-window']);
const dietSchema = z.enum(['standard', 'vegetarian', 'vegan', 'low-carb', 'high-protein', 'other']);

export const mealRecommendationSchema: z.ZodType<MealRecommendation> = z.object({
  allergens: z.array(z.string()),
  description: z.string(),
  id: z.string(),
  image: imageSchema,
  isLogged: z.boolean(),
  isSaved: z.boolean(),
  name: z.string(),
  nutrition: z.object({ calories: z.number().nonnegative(), proteinGrams: z.number().nonnegative() }),
  periods: z.array(mealPeriodSchema),
  supportedDiets: z.array(dietSchema),
  tags: z.array(z.string()),
});

export const homeSnapshotSchema: z.ZodType<HomeSnapshot> = z.object({
  activitySuggestion: z.object({
    caloriesEstimate: z.number().nonnegative(),
    durationMinutes: z.number().positive(),
    id: z.string(),
    isLogged: z.boolean(),
    name: z.string(),
  }).nullable(),
  companionPrompt: z.object({ body: z.string(), title: z.string() }),
  dailyProgress: z.object({
    activityMinutes: z.number().nonnegative(),
    mealGoal: z.number().positive(),
    mealsLogged: z.number().nonnegative(),
  }),
  generatedAt: z.string(),
  greeting: z.string(),
  localDate: z.string(),
  mealPeriod: mealPeriodSchema,
  periodTitle: z.string(),
  recommendations: z.array(mealRecommendationSchema),
});
