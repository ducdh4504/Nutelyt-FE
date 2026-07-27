import { z } from "zod";
import type { ImageSource } from "expo-image";

import { isImageSource } from "@/utils/image-source";

const imageSourceSchema = z.custom<number | ImageSource>(
  isImageSource,
  "Invalid image source",
);

const dashboardMacroSchema = z.object({
  id: z.enum(["carb", "protein", "fat"]),
  label: z.string(),
  value: z.string(),
  color: z.string(),
});

const dashboardWarningSchema = z.object({
  id: z.enum(["sodium", "protein"]),
  title: z.string(),
  message: z.string(),
  tone: z.enum(["danger", "warning"]),
});

const dashboardFoodEntrySchema = z.object({
  id: z.string(),
  day: z.string(),
  date: z.string(),
  title: z.string(),
  image: imageSourceSchema,
  tags: z.array(
    z.object({
      label: z.string(),
      tone: z.enum(["danger", "success", "neutral"]),
    }),
  ),
  suggestion: z.string(),
});

export const dashboardSchema = z.object({
  period: z.string(),
  insight: z.string(),
  calories: z.object({
    average: z.string(),
    unit: z.string(),
    delta: z.string(),
    score: z.string(),
  }),
  macros: z.array(dashboardMacroSchema),
  consistency: z.object({
    days: z.string(),
    label: z.string(),
    progress: z.number(),
  }),
  warnings: z.array(dashboardWarningSchema),
  chart: z.array(
    z.object({
      day: z.string(),
      carb: z.number(),
      protein: z.number(),
      fat: z.number(),
    }),
  ),
  chartNote: z.string(),
  foodGroups: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      count: z.number(),
      icon: z.string(),
    }),
  ),
  favoriteFoods: z.array(z.string()),
  diary: z.array(dashboardFoodEntrySchema),
  aiAdvice: z.string(),
  sodiumDetail: z.object({
    title: z.string(),
    subtitle: z.string(),
    status: z.string(),
    level: z.string(),
    actual: z.string(),
    recommended: z.string(),
    description: z.string(),
    relatedMeals: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        image: imageSourceSchema,
        note: z.string(),
      }),
    ),
    actions: z.array(z.string()),
    summary: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        unit: z.string(),
      }),
    ),
  }),
});
