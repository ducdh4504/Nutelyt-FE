import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

import { dashboardMock } from '../data/mock-dashboard';
import type { RouteProfileParams } from '../types';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

const aiImage = require('../../../../assets/images/Nutelyt-AI.png');
const detail = dashboardMock.sodiumDetail;

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="h-[56px] flex-row items-center bg-background px-5">
      <Pressable accessibilityLabel="Quay lại" accessibilityRole="button" className="h-12 w-12 items-start justify-center" onPress={onBack}>
        <Feather color={colors.primaryDark} name="arrow-left" size={22} />
      </Pressable>
      <Text className="text-[24px] font-bold leading-8 text-primary-700">{detail.title}</Text>
    </View>
  );
}

function WarningSummaryCard() {
  return (
    <View className="overflow-hidden rounded-[16px] border border-[#BA1A1A26] bg-[#FFF0EB] p-[17px]" style={{ boxShadow: '0 4px 20px rgba(186, 26, 26, 0.08)' }}>
      <View className="absolute right-0 top-0 rounded-bl-[8px] bg-[#BA1A1A] px-3 py-1">
        <Text className="text-xs font-bold uppercase leading-4 tracking-[0.3px] text-white">Có thể cần lưu ý</Text>
      </View>
      <View className="flex-row gap-4 pt-2">
        <View className="mt-1 h-12 w-12 items-center justify-center rounded-full bg-[#FFDAD6]">
          <Feather color="#BA1A1A" name="zap" size={20} />
        </View>
        <View className="min-w-0 flex-1 gap-2">
          <Text className="text-[18px] font-bold leading-7 text-foreground">{detail.status}</Text>
          <Text className="text-base leading-6 text-[#3D4A3F]">{detail.description}</Text>
          <Text className="text-sm font-semibold leading-5 text-[#BA1A1A]">{detail.level}</Text>
          <View className="gap-3 rounded-[8px] bg-white/60 p-3">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-base leading-6 text-[#3D4A3F]">Thực tế:</Text>
                <Text className="text-base leading-6 text-[#3D4A3F]">{detail.actual}</Text>
              </View>
              <View>
                <Text className="text-base font-bold leading-6 text-[#BA1A1A]">Giới hạn:</Text>
                <Text className="text-base font-bold leading-6 text-[#BA1A1A]">{detail.recommended}</Text>
              </View>
            </View>
            <View className="h-[10px] overflow-hidden rounded-full bg-[#E1E3E4]">
              <View className="h-[10px] w-full rounded-full bg-[#BA1A1A]" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function RelatedMeals() {
  return (
    <View className="gap-3">
      <Text className="text-xl font-semibold leading-7 text-foreground">Chi tiết bữa ăn</Text>
      {detail.relatedMeals.map((meal) => (
        <View className="flex-row gap-3 rounded-[16px] border border-[#E1E3E4] bg-card p-3" key={meal.id}>
          <Image accessibilityIgnoresInvertColors className="h-16 w-16 rounded-[12px]" resizeMode="cover" source={meal.image} />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-base font-semibold leading-6 text-foreground">{meal.title}</Text>
            <Text className="text-sm leading-5 text-[#3D4A3F]">{meal.note}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function AIUrgentCard() {
  return (
    <View className="gap-3 rounded-[16px] border-l-4 border-l-primary-600 bg-white/90 px-[21px] py-[21px]" style={{ boxShadow: '0 8px 32px rgba(0, 109, 55, 0.05)' }}>
      <View className="flex-row items-center gap-2">
        <Image accessibilityIgnoresInvertColors resizeMode="contain" source={aiImage} style={{ height: 28, width: 28 }} />
        <Text className="text-xl font-semibold leading-7 text-foreground">AI khuyến nghị khẩn cấp</Text>
      </View>
      <View className="rounded-[8px] border border-[#BA1A1A33] bg-[#FFDAD680] p-[13px]">
        <Text className="text-base font-bold leading-6 text-foreground">
          Nên cân nhắc giảm muối trong 3 ngày tới, chọn món thanh đạm hơn. Thông tin chỉ mang tính tham khảo trong bản MVP.
        </Text>
      </View>
      <Pressable accessibilityRole="button" className="h-11 flex-row items-center justify-center gap-2 rounded-full bg-primary-700">
        <Feather color="#FFFFFF" name="crosshair" size={14} />
        <Text className="text-xs font-bold leading-4 tracking-[0.6px] text-white">Xem thực đơn nhẹ nhàng</Text>
      </Pressable>
    </View>
  );
}

function SuggestedActions() {
  return (
    <View className="gap-3 rounded-[16px] border border-[#E1E3E4] bg-card p-[17px]">
      <Text className="text-xl font-semibold leading-7 text-foreground">Gợi ý điều chỉnh</Text>
      {detail.actions.map((action) => (
        <View className="flex-row items-center gap-3" key={action}>
          <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-50">
            <Feather color={colors.primaryDark} name="check" size={13} />
          </View>
          <Text className="flex-1 text-base leading-6 text-[#3D4A3F]">{action}</Text>
        </View>
      ))}
    </View>
  );
}

function NutritionSummary() {
  return (
    <View className="gap-3 opacity-80">
      <Text className="text-xl font-semibold leading-7 text-foreground">Tổng quan dinh dưỡng</Text>
      <View className="flex-row gap-3">
        {detail.summary.map((item) => (
          <View className="flex-1 items-center gap-1 rounded-[16px] border border-[#E1E3E4] bg-background p-[17px]" key={item.label}>
            <Text className="text-center text-base leading-6 text-[#3D4A3F]">{item.label}</Text>
            <Text className="text-center text-base leading-6 text-[#3D4A3F]">
              <Text className="font-bold text-primary-700">{item.value}</Text> {item.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DashboardWarningDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteProfileParams>();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header onBack={goBack} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 24, paddingBottom: Math.max(insets.bottom + 34, 64), paddingHorizontal: 20, paddingTop: 16 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-2">
          <Text className="text-center text-[28px] font-bold leading-9 text-foreground">{detail.subtitle}</Text>
          <Text className="text-center text-sm leading-5 text-[#3D4A3F]">Phân tích dựa trên các bữa ăn đã lưu từ {dashboardMock.period}</Text>
        </View>
        <View className="gap-4">
          <View className="flex-row items-center gap-2">
            <Feather color="#BA1A1A" name="alert-triangle" size={20} />
            <Text className="text-xl font-semibold leading-7 text-[#BA1A1A]">Cảnh báo sức khỏe tuần này</Text>
          </View>
          <WarningSummaryCard />
        </View>
        <RelatedMeals />
        <SuggestedActions />
        <AIUrgentCard />
        <NutritionSummary />
      </ScrollView>
    </View>
  );
}
