import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickScanBubble({ onPress }: { onPress: () => void }) {
  const float = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { duration: 1400, toValue: 1, useNativeDriver: true }),
        Animated.timing(float, { duration: 1400, toValue: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  return (
    <AnimatedPressable
      accessibilityRole="button"
      className="absolute bottom-[96px] right-6 h-14 flex-row items-center gap-3 rounded-full bg-primary-600 px-6"
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, { damping: 12, stiffness: 260, toValue: 0.97, useNativeDriver: true }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, { damping: 12, stiffness: 260, toValue: 1, useNativeDriver: true }).start();
      }}
      style={{
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.12)',
        transform: [{ translateY }, { scale }],
      }}
    >
      <Feather color="#FFFFFF" name="camera" size={20} />
      <Text className="text-base leading-6 text-white">Quét sản phẩm</Text>
    </AnimatedPressable>
  );
}
