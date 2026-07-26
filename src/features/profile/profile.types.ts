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

export type RouteProfileParams = {
  profile?: string | string[];
  foodId?: string | string[];
};
