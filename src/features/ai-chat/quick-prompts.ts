import type { MealPeriod } from '@/features/home';

export function getQuickPrompts(period: MealPeriod) {
  switch (period) {
    case 'breakfast':
      return ['Gợi ý bữa sáng nhanh', 'Tôi muốn ăn bún bò'];
    case 'lunch':
      return ['Gợi ý bữa trưa', 'Tôi muốn nấu bữa ăn 3 món'];
    case 'snack':
      return ['Gợi ý bữa nhẹ', 'Món này có phù hợp giảm cân không?'];
    case 'dinner':
      return ['Gợi ý bữa tối nhẹ', 'Tôi vừa ăn phở gà'];
    default:
      return ['Bạn đang đói?', 'Tập nhẹ 5 phút', 'Khởi động nhẹ'];
  }
}
