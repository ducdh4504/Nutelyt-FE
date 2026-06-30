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
      className="mt-4 h-14 items-center justify-center rounded-[12px] border-2 border-[#006492]"
      onPress={onPress}
    >
      <Text className="text-lg font-semibold text-[#006492]">{children}</Text>
    </Pressable>
  );
}