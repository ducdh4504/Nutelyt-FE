export type SubscriptionPlanId = 'basic' | 'monthly' | 'yearly';

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  title: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  isCurrent?: boolean;
  badge?: string;
};
