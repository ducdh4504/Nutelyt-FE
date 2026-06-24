import { TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/src/constants/tokens';
import { cn } from '@/src/lib/cn';
import { Typography } from '@/src/components/ui/typography';

type InputProps = TextInputProps & {
  className?: string;
  error?: string;
  helperText?: string;
  inputClassName?: string;
  label?: string;
};

export function Input({
  className,
  error,
  helperText,
  inputClassName,
  label,
  placeholderTextColor = colors.muted,
  ...props
}: InputProps) {
  return (
    <View className={cn('gap-2', className)}>
      {label ? <Typography variant="label">{label}</Typography> : null}
      <TextInput
        className={cn(
          'min-h-12 rounded-card border bg-card px-4 text-base text-foreground',
          error ? 'border-warning-500' : 'border-border',
          inputClassName
        )}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {error ? (
        <Typography tone="warning" variant="caption">
          {error}
        </Typography>
      ) : helperText ? (
        <Typography tone="muted" variant="caption">
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
}
