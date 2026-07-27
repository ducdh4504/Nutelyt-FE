import type { ImageSource } from "expo-image";
import { z } from "zod";

import type { MockRecipe, RecipeCatalog } from "@/features/ai-chat/ai-chat.types";
import { isImageSource } from "@/utils/image-source";

const recipeIdSchema = z.enum([
  "bun-bo",
  "canh-chua",
  "thit-kho",
  "chom-chom",
  "canh-kho-qua-nhoi-thit",
  "tom-rim",
  "chuoi",
]);

const imageSourceSchema = z.custom<number | ImageSource>(
  isImageSource,
  "Invalid image source",
);

export const recipeSchema: z.ZodType<MockRecipe> = z.object({
  id: recipeIdSchema,
  name: z.string(),
  image: imageSourceSchema,
  chips: z.array(z.string()),
  assistantIntro: z.string(),
  previewNutrition: z.array(
    z.object({ label: z.string(), value: z.string() }),
  ),
  summaryNutrition: z.object({
    calories: z.string(),
    protein: z.string(),
    carb: z.string(),
    fat: z.string(),
  }),
  overview: z.object({
    goodPoints: z.array(z.string()),
    notes: z.array(z.string()),
  }),
  ingredients: z.array(
    z.object({ title: z.string(), items: z.array(z.string()) }),
  ),
  steps: z.array(z.string()),
  nutritionRows: z.array(
    z.object({
      component: z.string(),
      amount: z.string(),
      value: z.string(),
    }),
  ),
});

export const recipeCatalogSchema: z.ZodType<RecipeCatalog> = z.object({
  recipes: z.record(recipeIdSchema, recipeSchema),
  firstMealSuggestionRecipeIds: z.array(recipeIdSchema),
  alternateMealSuggestionRecipeIds: z.array(recipeIdSchema),
});
