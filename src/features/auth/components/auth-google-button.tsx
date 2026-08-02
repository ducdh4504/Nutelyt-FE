import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from "react-native";

import { cn } from "@/utils/cn";

import { AUTH_FONT_FAMILY, authColors } from "../auth-theme";
import { authAssets } from "../data/auth-assets";

type AuthGoogleButtonProps = PressableProps & {
  className?: string;
  label: string;
  loading?: boolean;
};

export function AuthGoogleButton({
  className,
  disabled,
  label,
  loading = false,
  ...props
}: AuthGoogleButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      className={cn(
        "h-14 flex-row items-center justify-center gap-2 rounded-[12px] border border-[#BCCABB] bg-[#EDEEEB]",
        isDisabled && "opacity-60",
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={authColors.foreground} />
      ) : (
        <>
          <Image
            accessibilityElementsHidden
            contentFit="contain"
            source={authAssets.googleMark}
            style={{ height: 20, width: 20 }}
          />
          <Text
            className="text-base leading-6"
            style={{
              color: authColors.foreground,
              fontFamily: AUTH_FONT_FAMILY,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
