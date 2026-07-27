import { useQuery } from "@tanstack/react-query";

import { subscriptionApi } from "@/features/subscription/api/subscription.api";
import { subscriptionKeys } from "@/features/subscription/api/subscription.keys";
import { subscriptionMockRepository } from "@/features/subscription/repositories/mock-subscription.repository";

export function useSubscriptionPlans() {
  return useQuery({
    initialData: subscriptionMockRepository.getPlans,
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => subscriptionApi.getPlans(signal),
    queryKey: subscriptionKeys.plans(),
  });
}

export function useSubscriptionPlan(planId: string | string[] | undefined) {
  return useQuery({
    initialData: () => subscriptionMockRepository.getPlan(planId),
    initialDataUpdatedAt: 0,
    queryFn: ({ signal }) => subscriptionApi.getPlan(planId, signal),
    queryKey: subscriptionKeys.plan(planId),
  });
}
