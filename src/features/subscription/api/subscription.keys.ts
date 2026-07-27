import { getFirstRouteParam } from "@/utils/route-params";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  plan: (planId: string | string[] | undefined) =>
    [...subscriptionKeys.all, "plan", getFirstRouteParam(planId) ?? "default"] as const,
} as const;
