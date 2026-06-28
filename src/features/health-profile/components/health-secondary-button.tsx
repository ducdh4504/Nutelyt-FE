import { Pressable, Text } from 'react-native';

export function HealthSecondaryButton({
  children,
  onPress,
}: {
  children: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="mt-4 h-12 items-center justify-center rounded-[12px]"
      onPress={onPress}
    >
      <Text className="text-base text-primary-700">{children}</Text>
    </Pressable>
  );
}