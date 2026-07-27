import type { ImageSource } from "expo-image";
import { z } from "zod";

import type { FoodRecommendation } from "@/features/home/home.types";
import { isImageSource } from "@/utils/image-source";

const foodRecommendationSchema: z.ZodType<FoodRecommendation> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.custom<number | ImageSource>(isImageSource, "Invalid image source"),
});

export const foodRecommendationsSchema = z.array(foodRecommendationSchema);
