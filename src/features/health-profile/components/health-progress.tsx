import { Animated, View } from 'react-native';

export function HealthProgress({
  width,
}: {
  width: Animated.AnimatedInterpolation<string | number>;
}) {
  return (
    <View className="px-5 pt-3">
      <View className="h-2 overflow-hidden rounded-full bg-[#E8EFE9]">
        <Animated.View className="h-full rounded-full bg-primary-600" style={{ width }} />
      </View>
    </View>
  );
}