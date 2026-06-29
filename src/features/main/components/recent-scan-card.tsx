import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { MockFood } from '../types';

function statusColor(status: MockFood['status']) {
  if (status === 'safe') {
    return { bg: 'bg-primary-50', color: '#006D37', icon: 'check' as const };
  }
  if (status === 'avoid') {
    return { bg: 'bg-[#FFDAD6]', color: '#BA1A1A', icon: 'alert-circle' as const };
  }
  return { bg: 'bg-[#FFDCC3]', color: '#904D00', icon: 'alert-triangle' as const };
}

export function RecentScanCard({ food, onPress }: { food: MockFood; onPress: () => void }) {
  const tone = statusColor(food.status);

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-4 rounded-[12px] bg-[#F3F3F6] p-4"
      onPress={onPress}
    >
      <View className="h-14 w-14 rounded-[8px] border border-[#BCCABC33] bg-[#E2E2E5]" />
      <View className="min-w-0 flex-1">
        <Text className="text-base leading-6 text-foreground">{food.name}</Text>
        <Text className="text-sm leading-5 text-muted">
          {food.timeLabel} • {food.reason}
        </Text>
      </View>
      <View className={`h-8 w-8 items-center justify-center rounded-full ${tone.bg}`}>
        <Feather color={tone.color} name={tone.icon} size={16} />
      </View>
    </Pressable>
  );
}
