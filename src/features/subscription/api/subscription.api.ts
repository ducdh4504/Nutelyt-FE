import { featureFlags } from "@/config/feature-flags";
import {
  createSubscriptionPlanMockAdapter,
  subscriptionPlansMockAdapter,
} from "@/features/subscription/repositories/mock-subscription.repository";
import {
  subscriptionPlanSchema,
  subscriptionPlansSchema,
} from "@/features/subscription/schemas/subscription.schema";
import { httpClient } from "@/services/http/client";
import { parseApiResponse } from "@/services/http/parse-response";
import { getFirstRouteParam } from "@/utils/route-params";

export const subscriptionApi = {
  async getPlans(signal?: AbortSignal) {
    const response = await httpClient.get<unknown>("/subscription/plans", {
      adapter: featureFlags.enableMockApi ? subscriptionPlansMockAdapter : undefined,
      signal,
    });

    return parseApiResponse(subscriptionPlansSchema, response.data);
  },
  async getPlan(planId: string | string[] | undefined, signal?: AbortSignal) {
    const normalizedPlanId = getFirstRouteParam(planId) ?? "default";
    const response = await httpClient.get<unknown>(
      `/subscription/plans/${normalizedPlanId}`,
      {
        adapter: featureFlags.enableMockApi
          ? createSubscriptionPlanMockAdapter(planId)
          : undefined,
        signal,
      },
    );

    return parseApiResponse(subscriptionPlanSchema, response.data);
  },
} as const;
