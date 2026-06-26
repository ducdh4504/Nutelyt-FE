import { Pressable, Text, View, type PressableProps } from 'react-native';

import { cn } from '@/src/lib/cn';

type AuthGoogleButtonProps = PressableProps & {
  className?: string;
  textClassName?: string;
};

export function AuthGoogleButton({
  className,
  textClassName,
  ...props
}: AuthGoogleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'h-14 flex-row items-center justify-center gap-3 rounded-[12px] border-2 border-border bg-card',
        className
      )}
      {...props}
    >
      <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
        <Text className="text-lg font-bold text-[#4285F4]">G</Text>
      </View>
      <Text className={cn('text-base text-foreground', textClassName)}>
        Continue with Google
      </Text>
    </Pressable>
  );
}
