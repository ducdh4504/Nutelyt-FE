import { z } from "zod";

import type { SubscriptionPlan } from "@/features/subscription/subscription.types";

export const subscriptionPlanSchema: z.ZodType<SubscriptionPlan> = z.object({
  id: z.enum(["basic", "monthly", "yearly"]),
  title: z.string(),
  price: z.string(),
  period: z.string(),
  tagline: z.string(),
  features: z.array(z.string()),
  isCurrent: z.boolean().optional(),
  badge: z.string().optional(),
});

export const subscriptionPlansSchema = z.array(subscriptionPlanSchema);
