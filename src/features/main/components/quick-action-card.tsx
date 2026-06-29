import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { FeatherName } from '../types';

export function QuickActionCard({
  icon = 'check-circle',
  label,
  onPress,
}: {
  icon?: FeatherName;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[66px] flex-1 flex-row items-center justify-between rounded-[12px] border-2 border-border bg-card p-[18px]"
      onPress={onPress}
    >
      <View className="h-6 w-6 items-center justify-center rounded-full bg-[#C7D4C7]">
        <Feather color="#FFFFFF" name={icon} size={15} />
      </View>
      <Text className="max-w-[110px] text-right text-base font-extrabold leading-5 text-[#4FAA5D]">
        {label}
      </Text>
    </Pressable>
  );
}
