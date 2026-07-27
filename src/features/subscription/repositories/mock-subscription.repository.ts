import { subscriptionPlans } from "@/features/subscription/data/subscription-plans";
import {
  subscriptionPlanSchema,
  subscriptionPlansSchema,
} from "@/features/subscription/schemas/subscription.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";
import { getFirstRouteParam } from "@/utils/route-params";

const plans = subscriptionPlansSchema.parse(subscriptionPlans);

function getSubscriptionPlan(planId: string | string[] | undefined) {
  const normalizedPlanId = getFirstRouteParam(planId);
  const selectedPlan =
    plans.find((plan) => plan.id === normalizedPlanId && !plan.isCurrent) ?? plans[1];

  return subscriptionPlanSchema.parse(selectedPlan);
}

export const subscriptionMockRepository = {
  getPlan: getSubscriptionPlan,
  getPlans: () => plans,
} as const;

export const subscriptionPlansMockAdapter = createMockAdapter(
  subscriptionMockRepository.getPlans,
);

export function createSubscriptionPlanMockAdapter(
  planId: string | string[] | undefined,
) {
  return createMockAdapter(() => subscriptionMockRepository.getPlan(planId));
}
