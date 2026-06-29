import type { ComponentProps } from 'react';

import { Feather } from '@expo/vector-icons';

export type HealthProfileSummary = {
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  purpose?: string | string[];
  diseases: string[];
  goal: string | null;
  diet: string | null;
};

export type FoodStatus = 'safe' | 'warning' | 'avoid';
export type MainTab = 'home' | 'scan' | 'history' | 'profile';
export type FeatherName = ComponentProps<typeof Feather>['name'];

export type NutritionFacts = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  serving: string;
};

export type MockFood = {
  id: string;
  name: string;
  category: string;
  score: number;
  status: FoodStatus;
  statusLabel: string;
  timeLabel: string;
  reason: string;
  tags: string[];
  nutrition: NutritionFacts;
  alternatives: {
    name: string;
    score: number;
    note: string;
  }[];
};

export type RouteProfileParams = {
  profile?: string | string[];
  foodId?: string | string[];
};
