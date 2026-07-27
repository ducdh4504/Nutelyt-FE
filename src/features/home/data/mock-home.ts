import type { FoodRecommendation } from "@/features/home/home.types";

export const foodRecommendations: FoodRecommendation[] = [
  {
    id: "honey-grilled-chicken",
    name: "Ức gà nướng mật ong",
    description: "Giàu protein - ít béo",
    image: require("@assets/images/Food/Uc-ga-mat-ong.png"),
  },
  {
    id: "com-tam",
    name: "Cơm tấm",
    description: "Dinh dưỡng",
    image: require("@assets/images/Food/Com-tam.png"),
  },
  {
    id: "salmon-salad",
    name: "Salad cá hồi",
    description: "Giàu vitamin - tiêu hóa tốt",
    image: require("@assets/images/Food/Salad-ca-hoi.png"),
  },
];
