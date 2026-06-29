import { Pressable, ScrollView, Text } from 'react-native';

import type { FoodStatus } from '../types';

export type HistoryFilter = 'all' | FoodStatus;

const filters: { id: HistoryFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'safe', label: 'Phù hợp' },
  { id: 'avoid', label: 'Không phù hợp' },
  { id: 'warning', label: 'Cần lưu ý' },
];

export function HistoryFilterTabs({
  active,
  onChange,
}: {
  active: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={{ gap: 12, paddingRight: 20 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {filters.map((filter) => {
        const selected = active === filter.id;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`h-10 items-center justify-center rounded-full px-6 ${
              selected ? 'bg-primary-600' : 'bg-[#E8E8EA]'
            }`}
            key={filter.id}
            onPress={() => onChange(filter.id)}
          >
            <Text className={`text-base leading-6 ${selected ? 'text-[#00391A]' : 'text-muted'}`}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
