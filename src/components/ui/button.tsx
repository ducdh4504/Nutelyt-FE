import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { colors } from '@/src/constants/tokens';
import { cn } from '@/src/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PressableProps & {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  size?: ButtonSize;
  textClassName?: string;
  variant?: ButtonVariant;
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 border-primary-600',
  secondary: 'bg-primary-50 border-primary-100',
  outline: 'bg-transparent border-border',
  ghost: 'bg-transparent border-transparent',
  warning: 'bg-warning-500 border-warning-500',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-primary-700',
  outline: 'text-foreground',
  ghost: 'text-primary-700',
  warning: 'text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4',
  md: 'min-h-12 px-5',
  lg: 'min-h-14 px-6',
};

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size = 'md',
  textClassName,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const indicatorColor = variant === 'primary' || variant === 'warning' ? '#FFFFFF' : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'items-center justify-center rounded-card border',
        sizeClasses[size],
        buttonVariantClasses[variant],
        isDisabled && 'opacity-50',
        className
      )}
      disabled={isDisabled}
      {...props}>
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : typeof children === 'string' || typeof children === 'number' ? (
        <Text className={cn('text-base font-semibold', textVariantClasses[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
