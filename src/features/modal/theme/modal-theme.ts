/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { colors } from '@/theme/tokens';

const tintColorLight = colors.primary;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: colors.foreground,
    background: colors.background,
    tint: tintColorLight,
    icon: colors.muted,
    tabIconDefault: colors.muted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
