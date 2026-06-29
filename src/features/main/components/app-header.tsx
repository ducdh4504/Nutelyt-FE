import { Feather } from '@expo/vector-icons';
import { Image, Pressable, View } from 'react-native';

import { colors } from '@/src/constants/tokens';

type AppHeaderProps = {
  onBack?: () => void;
  rightIcon?: 'bell' | 'more-vertical' | 'share-2';
  onRightPress?: () => void;
};

export function AppHeader({ onBack, onRightPress, rightIcon = 'bell' }: AppHeaderProps) {
  return (
    <View
      className="h-14 flex-row items-center justify-between bg-background px-5"
      style={{ boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel={onBack ? 'Quay lại' : 'Nutelyt'}
          accessibilityRole="button"
          className="h-10 w-8 items-start justify-center"
          disabled={!onBack}
          onPress={onBack}
        >
          {onBack ? <Feather color={colors.primaryDark} name="arrow-left" size={20} /> : null}
        </Pressable>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require('@/assets/images/Nutelyt-text.png')}
          style={{ height: 24, width: 88 }}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        className="h-12 w-12 items-end justify-center"
        onPress={onRightPress}
      >
        <Feather color={colors.muted} name={rightIcon} size={20} />
      </Pressable>
    </View>
  );
}
