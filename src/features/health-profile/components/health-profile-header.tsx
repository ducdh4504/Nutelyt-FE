import { Feather } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/tokens';

const brand = colors.primaryDark;
const wordmarkImage = require('../../../../assets/images/Nutelyt-text.png');

export function HealthProfileHeader({
  onBack,
  step,
  totalSteps = 4,
}: {
  onBack: () => void;
  step: number;
  totalSteps?: number;
}) {
  return (
    <View
      className="h-14 flex-row items-center justify-between bg-background px-5"
      style={{ boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' }}
    >
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-12 w-12 items-center justify-center rounded-full"
        onPress={onBack}
      >
        <Feather color={brand} name="chevron-left" size={24} />
      </Pressable>
      <View className="absolute left-0 right-0 items-center" pointerEvents="none">
        <Image
          accessibilityLabel="Nutelyt"
          className="h-7 w-28"
          resizeMode="contain"
          source={wordmarkImage}
        />
      </View>
      <View className="rounded-full bg-[#EEEFF0] px-3 py-1">
        <Text className="text-sm font-semibold text-muted">
          {step + 1}/{totalSteps}
        </Text>
      </View>
    </View>
  );
}

export function HealthSectionHeader({
  centered = false,
  subtitle,
  title,
}: {
  centered?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <View className="gap-2">
      <Text
        className={`text-[28px] font-semibold leading-9 text-foreground ${
          centered ? 'text-center' : ''
        }`}
      >
        {title}
      </Text>
      <Text className={`text-base leading-6 text-muted ${centered ? 'text-center' : ''}`}>
        {subtitle}
      </Text>
    </View>
  );
}