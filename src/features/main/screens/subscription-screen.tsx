import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';
import { subscriptionPlans, type SubscriptionPlan, type SubscriptionPlanId } from '@/src/features/main/data/subscription-plans';

const wordmarkImage = require('../../../../assets/images/Nutelyt-text.png');
const mascotImage = require('../../../../assets/images/Nutelyt-AI.png');

const cardShadow = { boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' };
const selectedShadow = { boxShadow: '0 10px 24px rgba(39, 174, 96, 0.14)' };

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="h-14 flex-row items-center justify-between bg-background px-5" style={cardShadow}>
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

function FeatureItem({ children }: { children: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="mt-0.5 h-[15px] w-[15px] items-center justify-center rounded-full border border-primary-600">
        <Feather color={colors.primaryDark} name="check" size={10} />
      </View>
      <Text className="min-w-0 flex-1 text-sm leading-5 text-foreground">{children}</Text>
    </View>
  );
}

function PlanCard({
  isSelected,
  onSelect,
  plan,
}: {
  isSelected: boolean;
  onSelect: () => void;
  plan: SubscriptionPlan;
}) {
  const annual = plan.id === 'yearly';
  const disabled = Boolean(plan.isCurrent);

  return (
    <Pressable
      accessibilityRole="button"
      className={`overflow-hidden rounded-[16px] border bg-card p-[25px] ${
        annual
          ? 'border-2 border-warning-500 bg-[#FAFFF8]'
          : isSelected
            ? 'border-primary-600'
            : 'border-border'
      }`}
      onPress={onSelect}
      style={isSelected ? selectedShadow : undefined}
    >
      {plan.badge ? (
        <View className="absolute right-0 top-0 rounded-bl-[12px] bg-warning-500 px-4 py-1.5">
          <Text className="text-[11px] font-bold uppercase tracking-[0.55px] text-white">{plan.badge}</Text>
        </View>
      ) : null}

      <View className="gap-4">
        <View className="gap-1 pr-24">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-semibold leading-7 text-foreground">{plan.title}</Text>
            {isSelected && !disabled ? <Feather color={colors.primaryDark} name="check-circle" size={18} /> : null}
          </View>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-[24px] font-bold leading-8 text-foreground">{plan.price}</Text>
            <Text className="text-sm leading-5 text-muted">{plan.period}</Text>
          </View>
          <Text className={`text-sm leading-5 ${annual ? 'font-semibold text-primary-700' : 'text-muted'}`}>{plan.tagline}</Text>
        </View>

        <View className="gap-2">
          {plan.features.map((feature) => (
            <FeatureItem key={feature}>{feature}</FeatureItem>
          ))}
        </View>

        {disabled ? (
          <View className="h-14 items-center justify-center rounded-[12px] bg-[#DBE3F0]">
            <Text className="text-base font-bold leading-6 text-muted">Gói hiện tại</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function ComparisonRow({
  basic,
  feature,
  monthly,
  yearly,
}: {
  basic: boolean | string;
  feature: string;
  monthly: boolean | string;
  yearly: boolean | string;
}) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <Text className="text-sm font-semibold leading-5 text-primary-700">{value}</Text>;
    }

    return <Feather color={value ? colors.primaryDark : '#DC2626'} name={value ? 'check' : 'x'} size={16} />;
  };

  return (
    <View className="flex-row items-center border-b border-[#BCCBB94D] py-4">
      <Text className="min-w-0 flex-[1.6] text-sm leading-5 text-foreground">{feature}</Text>
      <View className="flex-1 items-center">{renderCell(basic)}</View>
      <View className="flex-1 items-center">{renderCell(monthly)}</View>
      <View className="flex-1 items-center">{renderCell(yearly)}</View>
    </View>
  );
}

export function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('monthly');
  const selectedPlan = useMemo(
    () => subscriptionPlans.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlans[1],
    [selectedPlanId]
  );
  const isPaidPlan = !selectedPlan.isCurrent;
  const ctaLabel =
    selectedPlan.id === 'basic'
      ? 'Đang dùng gói cơ bản'
      : selectedPlan.id === 'yearly'
        ? 'Đăng ký gói năm'
        : 'Đăng ký gói tháng';

  const subscribe = () => {
    if (!isPaidPlan) {
      return;
    }

    router.push({
      pathname: '/subscription/success',
      params: { planId: selectedPlan.id },
    } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]" style={{ paddingTop: insets.top }}>
      <Header onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile' as Href))} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 32, paddingBottom: Math.max(insets.bottom + 36, 72), paddingHorizontal: 20, paddingTop: 38 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-2 overflow-hidden rounded-[24px] bg-primary-600 p-6">
          <Image accessibilityIgnoresInvertColors className="h-14 w-14 rounded-full border-2 border-primary-600" resizeMode="cover" source={mascotImage} />
          <Text className="pt-1 text-center text-base leading-6 text-white">Chọn gói phù hợp với nhu cầu của bạn</Text>
          <Text className="px-3 text-center text-sm leading-5 text-white">
            Nâng cấp để mở khóa các tính năng cao cấp, trải nghiệm không quảng cáo và hỗ trợ AI thông minh hơn.
          </Text>
        </View>

        <View className="gap-2">
          {subscriptionPlans.map((plan) => (
            <PlanCard
              isSelected={selectedPlanId === plan.id}
              key={plan.id}
              onSelect={() => setSelectedPlanId(plan.id)}
              plan={plan}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          className={`h-14 items-center justify-center rounded-[12px] ${isPaidPlan ? 'bg-primary-600' : 'bg-[#DBE3F0]'}`}
          disabled={!isPaidPlan}
          onPress={subscribe}
          style={isPaidPlan ? selectedShadow : undefined}
        >
          <Text className={`text-base font-bold leading-6 ${isPaidPlan ? 'text-white' : 'text-muted'}`}>
            {ctaLabel}
          </Text>
        </Pressable>

        <View className="gap-6 pt-4">
          <Text className="text-center text-base leading-6 text-foreground">So sánh tính năng</Text>
          <View>
            <View className="flex-row border-b border-border pb-3">
              <Text className="flex-[1.6] text-sm font-bold uppercase leading-5 text-muted">Tính năng</Text>
              <Text className="flex-1 text-center text-sm font-bold uppercase leading-5 text-muted">Cơ bản</Text>
              <Text className="flex-1 text-center text-sm font-bold uppercase leading-5 text-muted">Tháng</Text>
              <Text className="flex-1 text-center text-sm font-bold uppercase leading-5 text-muted">Năm</Text>
            </View>
            <ComparisonRow basic={false} feature="Không quảng cáo" monthly yearly />
            <ComparisonRow basic={false} feature="Tăng số lượt tư vấn AI" monthly yearly />
            <ComparisonRow basic={false} feature="Phân tích sâu" monthly yearly />
            <ComparisonRow basic={false} feature="Ăn uống cá nhân hóa & theo dõi dài hạn" monthly yearly />
            <ComparisonRow basic={false} feature="Hỗ trợ ưu tiên" monthly={false} yearly />
            <ComparisonRow basic="-" feature="Tiết kiệm chi phí" monthly="-" yearly="20%" />
          </View>
          <Text className="px-4 text-center text-[11px] italic leading-[17px] text-muted">
            Bạn có thể hủy gói đăng ký bất cứ lúc nào trong phần cài đặt tài khoản.
          </Text>
        </View>

        <View className="items-center gap-1 pt-1">
          <View className="flex-row items-center gap-1">
            <Feather color={colors.primaryDark} name="lock" size={12} />
            <Text className="text-center text-sm font-semibold leading-5 text-primary-700">
              Thanh toán an toàn & bảo mật qua cổng nội địa
            </Text>
          </View>
          <Text className="pt-8 text-center text-sm leading-5 text-[#6D7B6C]">
            Chính sách bảo mật    Điều khoản dịch vụ
          </Text>
          <Text className="text-center text-sm leading-5 text-[#6D7B6C]">Trung tâm trợ giúp</Text>
          <Text className="pt-3 text-center text-sm leading-5 text-[#6D7B6C]">
            © 2026 Nutelyt AI. Đã mã hóa thanh toán bảo mật.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
