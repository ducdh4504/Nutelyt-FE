import type { ReactNode } from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/src/constants/tokens';
import { cn } from '@/src/lib/cn';

type ScreenContainerProps = ViewProps & {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  scroll?: boolean;
};

export function ScreenContainer({
  children,
  className,
  contentClassName,
  scroll = false,
  style,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const content = (
    <View className={cn('flex-1 px-screen py-6', contentClassName)}>{children}</View>
  );

  return (
    <View
      className={cn('flex-1 bg-background', className)}
      style={[{ paddingTop: insets.top }, style]}
      {...props}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom, spacing.xl),
          }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}
