import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/src/lib/cn';

type CardProps = ViewProps & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View className={cn('rounded-card border border-border bg-card p-5', className)} {...props}>
      {children}
    </View>
  );
}
