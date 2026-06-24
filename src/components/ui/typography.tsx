import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { cn } from '@/src/lib/cn';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';
type TextTone = 'default' | 'muted' | 'primary' | 'warning' | 'inverse';

type TypographyProps = TextProps & {
  className?: string;
  tone?: TextTone;
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  title: 'text-3xl font-bold leading-tight',
  subtitle: 'text-xl font-semibold leading-snug',
  body: 'text-base leading-6',
  caption: 'text-sm leading-5',
  label: 'text-sm font-semibold leading-5',
};

const toneClasses: Record<TextTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted',
  primary: 'text-primary-600',
  warning: 'text-warning-600',
  inverse: 'text-white',
};

export function Typography({
  className,
  tone = 'default',
  variant = 'body',
  ...props
}: TypographyProps) {
  return (
    <Text
      className={cn(variantClasses[variant], toneClasses[tone], className)}
      {...props}
    />
  );
}
