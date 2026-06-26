import { Feather } from '@expo/vector-icons';
import { useState, type ComponentProps } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Typography } from '@/src/components/ui';
import { colors } from '@/src/constants/tokens';
import { cn } from '@/src/lib/cn';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type AuthTextInputProps = TextInputProps & {
  canToggleSecureEntry?: boolean;
  className?: string;
  icon: FeatherIconName;
  label: string;
};

export function AuthTextInput({
  canToggleSecureEntry = false,
  className,
  icon,
  label,
  placeholderTextColor = colors.border,
  secureTextEntry,
  ...props
}: AuthTextInputProps) {
  const [isSecureEntryVisible, setIsSecureEntryVisible] = useState(false);
  const shouldHideText = Boolean(secureTextEntry && !isSecureEntryVisible);

  return (
    <View className={cn('gap-2', className)}>
      <Typography className="px-1 text-[#3D4A3F]" variant="label">
        {label}
      </Typography>

      <View className="h-14 flex-row items-center rounded-[12px] border-2 border-border bg-card px-[14px]">
        <Feather color="#7E8C80" name={icon} size={20} />
        <TextInput
          className="h-full flex-1 px-3 text-base text-foreground"
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={shouldHideText}
          {...props}
        />
        {canToggleSecureEntry ? (
          <Pressable
            accessibilityLabel={isSecureEntryVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            accessibilityRole="button"
            className="h-11 w-11 items-end justify-center"
            onPress={() => setIsSecureEntryVisible((current) => !current)}
          >
            <Feather
              color="#7E8C80"
              name={isSecureEntryVisible ? 'eye-off' : 'eye'}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
