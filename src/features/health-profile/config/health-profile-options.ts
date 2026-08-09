import type { DietPreference, GoalSpeed } from '../health-profile.types';

export const goalSpeedOptions: readonly { description: string; id: GoalSpeed; label: string }[] = [
  { id: 'mild', label: 'Nhẹ nhàng', description: 'Giảm cân từ từ, dễ duy trì lâu dài.' },
  { id: 'balanced', label: 'Cân bằng', description: 'Tốc độ phù hợp cho đa số mọi người.' },
  { id: 'aggressive', label: 'Tăng tốc', description: 'Cần theo dõi sát hơn để bảo đảm sức khỏe.' },
];

export const dietOptions: readonly { description: string; id: DietPreference; label: string }[] = [
  { id: 'standard', label: 'Tiêu chuẩn', description: 'Ăn đa dạng, cân bằng các nhóm chất.' },
  { id: 'vegetarian', label: 'Chay', description: 'Không dùng thịt và cá.' },
  { id: 'vegan', label: 'Thuần chay', description: 'Không dùng thực phẩm từ động vật.' },
  { id: 'low-carb', label: 'Ít tinh bột', description: 'Ưu tiên rau, đạm và chất béo tốt.' },
  { id: 'high-protein', label: 'Giàu đạm', description: 'Ưu tiên thực phẩm giàu protein.' },
  { id: 'other', label: 'Khác', description: 'Bạn có một chế độ ăn riêng.' },
];

export const commonAllergies = ['Hải sản', 'Đậu phộng', 'Sữa', 'Trứng', 'Đậu nành', 'Lúa mì'] as const;

export function getGoalSpeedLabel(value: GoalSpeed | null) {
  return goalSpeedOptions.find((option) => option.id === value)?.label ?? 'Chưa chọn';
}

export function getDietLabel(value: DietPreference | null) {
  return dietOptions.find((option) => option.id === value)?.label ?? 'Chưa chọn';
}
