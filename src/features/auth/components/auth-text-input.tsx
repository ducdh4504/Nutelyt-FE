import { Image } from "expo-image";
import { forwardRef, type ReactNode, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { cn } from "@/utils/cn";

import { AUTH_FONT_FAMILY, authColors } from "../auth-theme";
import { authEyeIcon, authIconAssets } from "../data/auth-assets";

type AuthInputIcon = keyof typeof authIconAssets;

type AuthTextInputProps = TextInputProps & {
  canToggleSecureEntry?: boolean;
  className?: string;
  compact?: boolean;
  error?: string;
  icon: AuthInputIcon;
  label: string;
  labelAccessory?: ReactNode;
};

export const AuthTextInput = forwardRef<TextInput, AuthTextInputProps>(
  function AuthTextInput(
    {
      canToggleSecureEntry = false,
      className,
      compact = false,
      error,
      icon,
      label,
      labelAccessory,
      onBlur,
      onFocus,
      placeholderTextColor = "#6B7280",
      secureTextEntry,
      ...props
    },
    ref,
  ) {
    const [isSecureEntryVisible, setIsSecureEntryVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const shouldHideText = Boolean(secureTextEntry && !isSecureEntryVisible);

    return (
      <View className={cn(compact ? "gap-1" : "gap-2", className)}>
        <View className={cn("flex-row items-center justify-between px-1", compact ? "min-h-6" : "min-h-5")}>
          <Text
            className={compact ? "text-base leading-6" : "text-sm leading-5"}
            style={{ color: authColors.muted, fontFamily: AUTH_FONT_FAMILY }}
          >
            {label}
          </Text>
          {labelAccessory}
        </View>

        <View
          className={cn(
            "flex-row items-center rounded-[12px] border bg-[#F3F4F1] pl-4",
            compact ? "h-[54px]" : "h-14",
            error
              ? "border-[#B42318]"
              : isFocused
                ? "border-[#006D33]"
                : "border-[#BCCABB]",
          )}
        >
          <Image
            accessibilityElementsHidden
            contentFit="contain"
            source={authIconAssets[icon]}
            style={{ height: 21, width: 20 }}
          />
          <TextInput
            ref={ref}
            accessibilityHint={error}
            accessibilityLabel={props.accessibilityLabel ?? label}
            className="h-full flex-1 px-3 text-base text-[#191C1B]"
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={shouldHideText}
            style={{ fontFamily: AUTH_FONT_FAMILY }}
            {...props}
          />
          {canToggleSecureEntry ? (
            <Pressable
              accessibilityLabel={
                isSecureEntryVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"
              }
              accessibilityRole="button"
              className="h-11 w-11 items-center justify-center"
              hitSlop={4}
              onPress={() =>
                setIsSecureEntryVisible((current) => !current)
              }
            >
              <View className="h-[20px] w-[22px] items-center justify-center">
                <Image
                  accessibilityElementsHidden
                  contentFit="contain"
                  source={authEyeIcon}
                  style={{ height: 15, width: 22 }}
                />
                {isSecureEntryVisible ? (
                  <View className="absolute h-px w-6 rotate-45 bg-[#536159]" />
                ) : null}
              </View>
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text
            accessibilityLiveRegion="polite"
            className="px-1 text-sm leading-5"
            style={{ color: authColors.error, fontFamily: AUTH_FONT_FAMILY }}
          >
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);
