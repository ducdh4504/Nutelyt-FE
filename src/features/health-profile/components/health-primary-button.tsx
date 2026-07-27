import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const shadow = { boxShadow: '0 4px 6px rgba(39, 174, 96, 0.3)' };

export function HealthPrimaryButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedPressable
      accessibilityRole="button"
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
      style={[
        styles.button,
        shadow,
        disabled ? styles.disabled : null,
        { transform: [{ scale }] },
      ]}
    >
      <Text style={styles.label}>Tiếp tục</Text>
      <Feather color="#FFFFFF" name="arrow-right" size={17} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
