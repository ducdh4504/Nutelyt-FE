import { z } from "zod";

import type { MockFood } from "@/features/food-analysis/food-analysis.types";

export const foodAnalysisSchema: z.ZodType<MockFood> = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  score: z.number(),
  status: z.enum(["safe", "warning", "avoid"]),
  statusLabel: z.string(),
  timeLabel: z.string(),
  reason: z.string(),
  tags: z.array(z.string()),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    sodium: z.number(),
    serving: z.string(),
  }),
  alternatives: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      note: z.string(),
    }),
  ),
});

export const foodAnalysesSchema = z.array(foodAnalysisSchema);
