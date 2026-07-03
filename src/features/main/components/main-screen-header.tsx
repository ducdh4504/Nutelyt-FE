import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MainScreenHeaderProps = {
  align?: 'left' | 'center';
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
};

export function MainScreenHeader({ align = 'left', rightSlot, subtitle, title }: MainScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const centered = align === 'center';

  return (
    <View
      className="bg-background px-5"
      style={{
        paddingBottom: 22,
        paddingTop: Math.max(insets.top + 20, 32),
      }}
    >
      <View className={`min-h-[60px] flex-row items-center gap-4 ${centered ? 'justify-center' : 'justify-between'}`}>
        {centered && rightSlot ? <View className="w-16" /> : null}
        <View className={`min-w-0 flex-1 gap-1 ${centered ? 'items-center' : ''}`}>
          <Text
            className={`text-[28px] font-semibold leading-9 text-foreground ${centered ? 'text-center' : ''}`}
            numberOfLines={2}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className={`text-base leading-6 text-muted ${centered ? 'text-center' : ''}`} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightSlot ? <View className="items-end">{rightSlot}</View> : null}
      </View>
    </View>
  );
}
