import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const shadow = { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' };

export function HealthPrimaryButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      className="h-14 flex-row items-center justify-center gap-2 rounded-[12px] bg-primary-600"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          damping: 12,
          stiffness: 260,
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          damping: 12,
          stiffness: 260,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      style={[shadow, { opacity: disabled ? 0.45 : 1, transform: [{ scale }] }]}
    >
      <Text className="text-base text-white">Tiếp tục</Text>
      <Feather color="#FFFFFF" name="arrow-right" size={17} />
    </AnimatedPressable>
  );
}