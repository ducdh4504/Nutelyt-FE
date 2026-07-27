import { env } from "@/config/env";

export const featureFlags = {
  enableMockApi: env.enableMockApi,
  enableDevtools: env.environment !== "production" && env.enableDevtools,
  enableLogger: env.environment !== "production" && env.enableLogger,
  enableAI: true,
  enableSubscription: true,
  enableNotifications: false,
  enableAnalytics: false,
} as const;
