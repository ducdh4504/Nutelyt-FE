import type { ImageSource } from "expo-image";

export type FoodRecommendation = {
  id: string;
  name: string;
  description: string;
  image: number | ImageSource;
};
