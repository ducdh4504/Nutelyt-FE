import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

export default function HealthProfileCompleteRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-6"
      style={{ paddingBottom: Math.max(insets.bottom, 24), paddingTop: insets.top }}
    >
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
        <Feather color={colors.primaryDark} name="check" size={34} />
      </View>
      <Text className="mt-6 text-center text-[28px] leading-9 text-foreground">
        Hoàn tất hồ sơ sức khỏe
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-muted">
        Đây là màn hình tạm thời. Home/Dashboard sẽ được triển khai ở bước tiếp theo.
      </Text>
      <Pressable
        accessibilityRole="button"
        className="mt-8 h-14 w-full max-w-[350px] items-center justify-center rounded-[12px] bg-primary-600"
        onPress={() => router.replace('/login')}
      >
        <Text className="text-base text-white">Quay lại đăng nhập</Text>
      </Pressable>
    </View>
  );
}
