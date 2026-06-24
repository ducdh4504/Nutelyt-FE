import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '@/src/components/layout';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding' as never);
    }, 1300);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer className="bg-white" contentClassName="px-0 py-0">
      <View className="flex-1 items-center justify-center overflow-hidden bg-white">
        <View className="absolute -left-10 -top-16 h-80 w-40 rounded-full bg-[#61DE8A] opacity-30" />
        <View className="absolute -bottom-16 -right-10 h-80 w-40 rounded-full bg-[#8CCDFF] opacity-30" />

        <View className="items-center justify-center">
          <View className="absolute h-[298px] w-[293px] rounded-full border border-primary-100 opacity-70" />
          <View className="items-center gap-2">
            <Text className="text-[46px] font-bold leading-[56px] text-primary-700">Nutelyt</Text>
            <Text className="text-base font-semibold tracking-[0.2px] text-muted">Eat smarter. Live better.</Text>
          </View>
        </View>

        <View className="absolute bottom-12 items-center gap-4">
          <View className="flex-row items-center gap-2 rounded-full bg-[#EEEEF0] px-4 py-2">
            <View className="h-3.5 w-3 rounded-full bg-primary-600" />
            <Text className="text-sm font-semibold tracking-[0.14px] text-muted">Powered by Advanced AI</Text>
          </View>
          <View className="h-1 w-12 overflow-hidden rounded-full bg-[#E2E2E5]">
            <View className="h-full w-full rounded-full bg-primary-600" />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
