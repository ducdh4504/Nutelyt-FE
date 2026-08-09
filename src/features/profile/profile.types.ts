import type { Gender, HealthProfileValues } from '@/features/health-profile';

export type PersonalProfileDraft = {
  birthday: string;
  fullName: string;
  gender: Gender | null;
};

export type HealthProfileDraft = HealthProfileValues;

export type WeightMeasurement = {
  id: string;
  measuredAt: string;
  weightKg: number;
};
