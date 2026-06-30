import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Feather>['name'];
export type Gender = 'Nam' | 'Nữ' | 'Khác';

export type HealthOption = {
  description?: string;
  icon: IconName;
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