import type { ComponentProps } from 'react';

import { Feather } from '@expo/vector-icons';

export type { FoodStatus, MockFood, NutritionFacts } from '../food-analysis/food-analysis.types';
export type { HealthProfileSummary, RouteProfileParams } from '../profile/profile.types';

export type MainTab = 'home' | 'history' | 'chat-ai' | 'profile';
export type FeatherName = ComponentProps<typeof Feather>['name'];
