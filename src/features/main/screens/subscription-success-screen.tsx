import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';
import { getSubscriptionPlan } from '@/src/features/main/data/subscription-plans';

const wordmarkImage = require('../../../../assets/images/Nutelyt-text.png');
const mascotImage = require('../../../../assets/images/Nutelyt-AI.png');

const cardShadow = { boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' };
const successShadow = { boxShadow: '0 10px 15px rgba(0, 0, 0, 0.12)' };

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="h-14 flex-row items-center justify-between bg-[#F8F9FF] px-5" style={cardShadow}>
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-12 w-12 items-start justify-center"
        onPress={onBack}
      >
        <Feather color={colors.primaryDark} name="chevron-left" size={24} />
      </Pressable>
      <View className="absolute left-0 right-0 items-center" pointerEvents="none">
        <Image accessibilityLabel="Nutelyt" className="h-7 w-28" resizeMode="contain" source={wordmarkImage} />
      </View>
      <View className="h-12 w-12" />
    </View>
  );
}

function formatDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

function addBillingPeriod(date: Date, yearly: boolean) {
  const nextDate = new Date(date);
  if (yearly) {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  return nextDate;
}

function DateSummary({ icon, label, value }: { icon: 'calendar' | 'clock'; label: string; value: string }) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Feather color={colors.primaryDark} name={icon} size={22} />
      <View className="min-w-0 flex-1">
        <Text className="text-[12px] uppercase leading-[13px] text-[#6F7776]">{label}</Text>
        <Text className="text-[12px] font-semibold leading-[13px] text-[#6F7776]">{value}</Text>
      </View>
    </View>
  );
}

export function SubscriptionSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ planId?: string | string[] }>();
  const plan = useMemo(() => getSubscriptionPlan(params.planId), [params.planId]);
  const periodLabel = plan.period.trim();
  const startDate = useMemo(() => new Date(), []);
  const renewalDate = useMemo(() => addBillingPeriod(startDate, plan.id === 'yearly'), [plan.id, startDate]);

  return (
    <View className="flex-1 bg-[#F8F9FF]" style={{ paddingTop: insets.top }}>
      <Header onBack={() => (router.canGoBack() ? router.back() : router.replace('/subscription' as Href))} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 24, paddingBottom: Math.max(insets.bottom + 36, 72), paddingHorizontal: 20, paddingTop: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-600" style={successShadow}>
            <Feather color="#FFFFFF" name="check" size={42} />
          </View>
          <View className="items-center gap-1 pt-2">
            <Text className="text-center text-base leading-6 text-foreground">Thanh toán thành công!</Text>
            <Text className="text-center text-base leading-6 text-muted">Chào mừng bạn gia nhập cộng đồng Premium</Text>
          </View>
        </View>

        <View className="gap-4 rounded-[16px] border border-[#BCCBB94D] bg-card p-[25px]" style={cardShadow}>
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-base uppercase tracking-[0.8px] text-primary-700">THÔNG TIN GÓI</Text>
              <Text className="text-base leading-6 text-foreground">{plan.title}</Text>
            </View>
            <View className="rounded-full bg-[#D7F3E3] px-4 py-1">
              <Text className="text-[12px] font-bold leading-4 tracking-[0.6px] text-primary-700">Đang hoạt động</Text>
            </View>
          </View>

          <View className="flex-row items-baseline gap-1">
            <Text className="text-base leading-6 text-primary-700">{plan.price}</Text>
            <Text className="text-base leading-6 text-[#6D7B6C]">{periodLabel}</Text>
          </View>

          <View className="h-px bg-[#BCCBB94D]" />

          <View className="flex-row justify-between gap-6">
            <DateSummary icon="calendar" label="Ngày bắt đầu" value={formatDate(startDate)} />
            <DateSummary icon="clock" label="Ngày gia hạn" value={formatDate(renewalDate)} />
          </View>
        </View>

        <View className="flex-row items-center gap-6 rounded-[16px] border border-primary-600/10 bg-[#D7F3E333] p-[25px]">
          <Image accessibilityIgnoresInvertColors className="h-20 w-20 rounded-full border-2 border-primary-600" resizeMode="cover" source={mascotImage} />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-base leading-5 text-primary-700">Tuyệt vời!</Text>
            <View className="flex-row items-start gap-1">
              <Feather color={colors.primaryDark} name="award" size={16} />
              <Text className="min-w-0 flex-1 text-sm leading-5 text-primary-700/80">
                Đã kích hoạt toàn bộ tính năng VIP
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-4 pt-10">
          <Pressable
            accessibilityRole="button"
            className="h-14 flex-row items-center justify-center gap-2 rounded-[12px] bg-primary-600"
            onPress={() => router.replace('/home' as Href)}
            style={successShadow}
          >
            <Feather color="#FFFFFF" name="home" size={18} />
            <Text className="text-base font-bold leading-6 text-white">Về trang chủ</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="h-[60px] flex-row items-center justify-center gap-2 rounded-[12px] border-2 border-primary-600"
            onPress={() => router.replace('/home' as Href)}
          >
            <Feather color={colors.primaryDark} name="shuffle" size={18} />
            <Text className="text-base font-bold leading-6 text-primary-700">Xem kế hoạch bữa ăn của bạn</Text>
          </Pressable>
        </View>

        <View className="items-center gap-4 border-t border-border pt-8">
          <Text className="text-center text-base leading-6 text-[#6D7B6C]">Chính sách bảo mật    Điều khoản dịch vụ</Text>
          <Text className="text-center text-base leading-6 text-[#6D7B6C]">Trung tâm trợ giúp</Text>
          <Text className="text-center text-base leading-6 text-[#6D7B6C]">
            © 2026 Nutelyt AI. Đã mã hóa thanh toán bảo mật.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
