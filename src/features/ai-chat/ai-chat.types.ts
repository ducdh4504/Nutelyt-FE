import type { ImageSource } from "expo-image";

export type RecipeId =
  | "bun-bo"
  | "canh-chua"
  | "thit-kho"
  | "chom-chom"
  | "canh-kho-qua-nhoi-thit"
  | "tom-rim"
  | "chuoi";

export type MockRecipe = {
  id: RecipeId;
  name: string;
  image: number | ImageSource;
  chips: string[];
  assistantIntro: string;
  previewNutrition: {
    label: string;
    value: string;
  }[];
  summaryNutrition: {
    calories: string;
    protein: string;
    carb: string;
    fat: string;
  };
  overview: {
    goodPoints: string[];
    notes: string[];
  };
  ingredients: {
    title: string;
    items: string[];
  }[];
  steps: string[];
  nutritionRows: {
    component: string;
    amount: string;
    value: string;
  }[];
};
