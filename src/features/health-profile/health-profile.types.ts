import type { FeatherIconName } from '@/types/icon.types';

export type Gender = 'Nam' | 'Nữ' | 'Khác';
export type GoalSpeed = 'mild' | 'balanced' | 'aggressive';
export type DietPreference = 'standard' | 'vegetarian' | 'vegan' | 'low-carb' | 'high-protein' | 'other';

/** Values the user enters while moving through the setup wizard. */
export type HealthProfileValues = {
  allergies: string[];
  birthday: string;
  currentWeight: string;
  diet: DietPreference | null;
  fullName: string;
  gender: Gender | null;
  goalSpeed: GoalSpeed | null;
  height: string;
  targetWeight: string;
};

export type HealthProfileWizardState = {
  fieldErrors: Partial<Record<keyof HealthProfileValues, string>>;
  isSubmitting: boolean;
  step: number;
  values: HealthProfileValues;
};

export type HealthProfilePresentation = {
  allergiesLabel: string;
  bmiCategory: string;
  bmiValue: number | null;
  dietLabel: string;
  goalSpeedLabel: string;
};

/** Retained for legacy feature consumers until their UI is migrated. */
export type HealthOption = {
  description?: string;
  icon: FeatherIconName;
  id: string;
  label: string;
  tone: string;
};

/** Retained as the legacy-to-new-profile adapter input. */
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

/**
 * The runtime profile shape used by existing Home, Profile, Dashboard, and
 * Food Analysis screens. New fields preserve the weight-loss wizard data.
 */
export type HealthProfileSummary = {
  age: string;
  allergies?: string[];
  allergyText: string;
  birthday?: string;
  conditionLabels: string[];
  conditions: string[];
  currentWeight?: string;
  dateOfBirth: string;
  diet: string | null;
  dietLabel: string;
  diseases: string[];
  fullName: string;
  gender: string;
  goal: string | null;
  goalLabel: string;
  goalSpeed?: GoalSpeed;
  height: string;
  purpose?: string | string[];
  targetWeight?: string;
  weight: string;
};
