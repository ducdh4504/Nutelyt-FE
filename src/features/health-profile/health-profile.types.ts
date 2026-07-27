import type { FeatherIconName } from '@/types/icon.types';

export type Gender = 'Nam' | 'Nữ' | 'Khác';

export type HealthOption = {
  description?: string;
  icon: FeatherIconName;
  id: string;
  label: string;
  tone: string;
};

export type HealthProfilePayload = {
  allergyText: string;
  conditionLabels: string[];
  conditions: string[];
  dateOfBirth: string;
  diet: string | null;
  dietLabel: string;
  fullName: string;
  gender: Gender | string;
  goal: string;
  goalLabel: string;
  height: string;
  weight: string;
};

export type HealthProfileSummary = {
  allergyText: string;
  conditionLabels: string[];
  conditions: string[];
  dateOfBirth: string;
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  purpose?: string | string[];
  diseases: string[];
  goal: string | null;
  goalLabel: string;
  diet: string | null;
  dietLabel: string;
};
