export type FoodStatus = 'safe' | 'warning' | 'avoid';

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
