import { Text, View } from 'react-native';

import type { NutritionFacts } from '../types';

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center rounded-[8px] bg-background p-3">
      <Text className="text-[20px] font-semibold leading-7 text-foreground">{value}</Text>
      <Text className="text-sm font-semibold leading-5 text-muted">{label}</Text>
    </View>
  );
}

export function NutritionCard({ nutrition }: { nutrition: NutritionFacts }) {
  return (
    <View
      className="gap-5 rounded-[12px] border border-[#E2E2E5] bg-card p-[25px]"
      style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.06)' }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[20px] font-semibold leading-7 text-foreground">Thông tin dinh dưỡng</Text>
        <Text className="text-right text-sm font-semibold leading-5 text-muted">{nutrition.serving}</Text>
      </View>
      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-sm font-semibold leading-5 text-foreground">Calories</Text>
          <Text className="text-sm font-semibold leading-5 text-foreground">
            {nutrition.calories} kcal
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-[#EEEEF0]">
          <View
            className="h-2 rounded-full bg-[#006492]"
            style={{ width: `${Math.min(100, Math.max(12, nutrition.calories / 6))}%` }}
          />
        </View>
      </View>
      <View className="flex-row gap-4">
        <Macro label="Fats" value={`${nutrition.fat}g`} />
        <Macro label="Carbs" value={`${nutrition.carbs}g`} />
        <Macro label="Protein" value={`${nutrition.protein}g`} />
      </View>
      <View className="rounded-[8px] bg-[#F3F3F6] px-4 py-3">
        <Text className="text-sm font-semibold text-muted">Sodium: {nutrition.sodium}mg</Text>
      </View>
    </View>
  );
}
