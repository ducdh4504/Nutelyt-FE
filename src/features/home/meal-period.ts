import type { MealPeriod } from './home.types';

const periodCopy: Record<MealPeriod, { greeting: string; title: string }> = {
  breakfast: { greeting: 'Chào buổi sáng', title: 'Gợi ý cho bữa sáng' },
  lunch: { greeting: 'Chào buổi trưa', title: 'Gợi ý cho bữa trưa' },
  snack: { greeting: 'Chào buổi chiều', title: 'Gợi ý bữa nhẹ' },
  dinner: { greeting: 'Chào buổi chiều', title: 'Gợi ý cho bữa tối nhẹ nhàng' },
  'outside-meal-window': { greeting: 'Chào bạn', title: 'Một lựa chọn nhẹ nhàng' },
};

export function resolveMealPeriod(date: Date): MealPeriod {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 360 && minutes < 630) return 'breakfast';
  if (minutes >= 630 && minutes < 750) return 'lunch';
  if (minutes >= 750 && minutes < 960) return 'snack';
  if (minutes >= 960 && minutes < 1110) return 'dinner';
  return 'outside-meal-window';
}

export function getMealPeriodCopy(period: MealPeriod) {
  return periodCopy[period];
}

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
