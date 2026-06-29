import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { MockFood } from '../types';

function tone(status: MockFood['status']) {
  if (status === 'safe') {
    return { badge: 'bg-primary-50', color: '#006D37', icon: 'check-circle' as const };
  }
  if (status === 'avoid') {
    return { badge: 'bg-[#FFDAD6]', color: '#BA1A1A', icon: 'alert-circle' as const };
  }
  return { badge: 'bg-[#FFDCC3]', color: '#904D00', icon: 'alert-triangle' as const };
}

export function HistoryFoodCard({ food, onPress }: { food: MockFood; onPress: () => void }) {
  const currentTone = tone(food.status);

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center rounded-[12px] bg-card p-[17px]"
      onPress={onPress}
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.04)' }}
    >
      <View className="h-16 w-16 rounded-[8px] bg-[#EEEEF0]" />
      <View className="min-w-0 flex-1 gap-1 pl-4">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="min-w-0 flex-1 text-base leading-6 text-foreground">{food.name}</Text>
          <View className="flex-row items-center gap-1">
            <Feather color={currentTone.color} name={currentTone.icon} size={15} />
            <Text className="text-base leading-6" style={{ color: currentTone.color }}>
              {food.score}
            </Text>
          </View>
        </View>
        <Text className="text-sm leading-5 text-muted">{food.timeLabel}</Text>
        <View className="flex-row flex-wrap gap-2 pt-1">
          {food.tags.slice(0, 2).map((tag) => (
            <View className={`rounded-[4px] px-2 py-0.5 ${currentTone.badge}`} key={tag}>
              <Text className="text-[10px] font-bold uppercase leading-[15px]" style={{ color: currentTone.color }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Feather color="#BCCABC" name="chevron-right" size={18} />
    </Pressable>
  );
}
