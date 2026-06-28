import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/tokens';

import type { HealthOption } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const shadow = { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' };
const primary = colors.primary;

function HealthOptionIcon({ option }: { option: HealthOption }) {
  return (
    <View
      className="h-12 w-12 items-center justify-center rounded-full"
      style={{ backgroundColor: `${option.tone}18` }}
    >
      <Feather color={option.tone} name={option.icon} size={21} />
    </View>
  );
}

export function HealthOptionCard({
  bento = false,
  compact = false,
  index,
  isSelected,
  onPress,
  option,
  wide = false,
}: {
  bento?: boolean;
  compact?: boolean;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  option: HealthOption;
  wide?: boolean;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const selectedScale = useRef(new Animated.Value(isSelected ? 1.01 : 1)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      delay: index * 55,
      duration: 260,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [entrance, index]);

  useEffect(() => {
    Animated.spring(selectedScale, {
      damping: 15,
      stiffness: 180,
      toValue: isSelected ? 1.01 : 1,
      useNativeDriver: true,
    }).start();
  }, [isSelected, selectedScale]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`rounded-[12px] border-2 bg-card ${
        bento ? 'p-[22px]' : compact ? 'px-[18px] py-[18px]' : 'p-[22px]'
      }`}
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(pressScale, {
          damping: 12,
          stiffness: 260,
          toValue: 0.97,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(pressScale, {
          damping: 12,
          stiffness: 260,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      style={[
        shadow,
        bento ? { minHeight: 175, width: '47.5%' } : undefined,
        compact ? { minHeight: 84, width: '100%' } : undefined,
        wide ? { minHeight: 104, width: '100%' } : undefined,
        {
          borderColor: isSelected ? primary : 'transparent',
          opacity: entrance,
          transform: [
            { translateY },
            { scale: Animated.multiply(pressScale, selectedScale) },
          ],
        },
      ]}
    >
      {bento ? (
        <View className="flex-1 justify-between">
          <HealthOptionIcon option={option} />
          <View className="gap-1">
            <Text className="text-xl leading-7 text-foreground">{option.label}</Text>
            <Text className="text-sm leading-[18px] text-muted">{option.description}</Text>
          </View>
        </View>
      ) : (
        <View className={`flex-row ${compact || wide ? 'items-center gap-4' : 'gap-4'}`}>
          <HealthOptionIcon option={option} />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-xl leading-7 text-foreground">{option.label}</Text>
            {option.description ? (
              <Text className="text-base leading-6 text-muted">{option.description}</Text>
            ) : null}
          </View>
          {isSelected ? (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-600">
              <Feather color="#FFFFFF" name="check" size={15} />
            </View>
          ) : (
            <View className="h-6 w-6 rounded-full border border-[#C9D4CA]" />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}