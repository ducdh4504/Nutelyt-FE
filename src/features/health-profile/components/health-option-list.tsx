import { View } from 'react-native';

import type { HealthOption } from '../types';
import { HealthOptionCard } from './health-option-card';

export function HealthOptionList({
  options,
  selected,
  setSelected,
}: {
  options: HealthOption[];
  selected: string;
  setSelected: (id: string) => void;
}) {
  return (
    <View className="gap-4">
      {options.map((item, index) => (
        <HealthOptionCard
          index={index}
          isSelected={selected === item.id}
          key={item.id}
          onPress={() => setSelected(item.id)}
          option={item}
        />
      ))}
    </View>
  );
}