import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  subscriptionPlans,
  type SubscriptionPlan,
  type SubscriptionPlanId,
} from "@/src/features/main/data/subscription-plans";

const wordmarkImage = require("../../../../assets/images/Nutelyt-text.png");
const mascotImage = require("../../../../assets/images/Nutelyt-AI.png");

const ui = {
  background: "#F7F8FC",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#DDE3E0",

  primary: "#27AE60",
  primaryDark: "#27AE60",
  primarySoft: "#E9F8EF",

  orange: "#F59E0B",
  orangeDark: "#F59E0B",
  orangeSoft: "#FFF8E8",

  danger: "#DC2626",
  disabled: "#DDE6F2",
};

const selectedShadow = {
  shadowColor: "#16C96D",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 20,
  elevation: 4,
};

const orangeShadow = {
  shadowColor: "#CD8308",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 20,
  elevation: 4,
};

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View
      className="h-[54px] flex-row items-center justify-between px-4"
      style={{ backgroundColor: ui.background }}
    >
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-11 w-11 items-start justify-center"
        onPress={onBack}
      >
        <Feather color="#334155" name="chevron-left" size={23} />
      </Pressable>

      <View
        className="absolute left-0 right-0 items-center"
        pointerEvents="none"
      >
        <Image
          accessibilityLabel="Nutelyt"
          className="h-[30px] w-[100px]"
          contentFit="contain"
          source={wordmarkImage}
        />

        <Text className="-mt-1 text-[10px] font-medium text-[#0F9F5A]">
          Săn sáng hệ tạo bạn
        </Text>
      </View>

      <View className="h-11 w-11" />
    </View>
  );
}

function HeroCard() {
  return (
    <View
      className="items-center overflow-hidden rounded-[22px] px-5 pb-8 pt-6"
      style={{ backgroundColor: "#0FBF6A" }}
    >
      <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
      <View className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/10" />

      <Image
        accessibilityIgnoresInvertColors
        className="h-[58px] w-[58px] rounded-full bg-white"
        contentFit="cover"
        source={mascotImage}
      />

      <Text className="mt-5 text-center text-[15px] leading-6 text-white">
        Chọn gói phù hợp với nhu cầu của bạn
      </Text>

      <Text className="mt-1 text-center text-[13px] leading-5 text-white/95">
        Nâng cấp để mở khóa các tính năng cao cấp, trải nghiệm không quảng cáo
        và hỗ trợ AI thông minh hơn.
      </Text>
    </View>
  );
}

function FeatureItem({ children }: { children: string }) {
  return (
    <View className="flex-row items-start gap-2">
      <View
        className="mt-[3px] h-[14px] w-[14px] items-center justify-center rounded-full border"
        style={{ borderColor: ui.primaryDark }}
      >
        <Feather color={ui.primaryDark} name="check" size={9} />
      </View>

      <Text
        className="min-w-0 flex-1 text-[12px] leading-[18px]"
        style={{ color: ui.text }}
      >
        {children}
      </Text>
    </View>
  );
}

function PlanCard({
  isSelected,
  onSelect,
  onSubscribe,
  plan,
}: {
  isSelected: boolean;
  onSelect: () => void;
  onSubscribe: () => void;
  plan: SubscriptionPlan;
}) {
  const isYearly = plan.id === "yearly";
  const isMonthly = plan.id === "monthly";
  const disabled = Boolean(plan.isCurrent);

  const borderColor = isYearly
    ? ui.orange
    : isMonthly || isSelected
      ? ui.primaryDark
      : ui.border;

  const backgroundColor = isYearly ? "#FFFFF8" : ui.card;

  const buttonLabel = disabled
    ? "Gói hiện tại"
    : isYearly
      ? "Đăng ký hằng năm"
      : "Đăng ký ngay";

  return (
    <Pressable
      accessibilityRole="button"
      className="overflow-hidden rounded-[14px] border p-5"
      onPress={onSelect}
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: isYearly || isMonthly || isSelected ? 1.5 : 1,
        },
        isSelected && !isYearly ? selectedShadow : undefined,
        isYearly ? orangeShadow : undefined,
      ]}
    >
      {plan.badge ? (
        <View
          className="absolute right-0 top-0 rounded-bl-[10px] px-3 py-1"
          style={{ backgroundColor: ui.orange }}
        >
          <Text className="text-[10px] font-bold uppercase tracking-[0.4px] text-white">
            {plan.badge}
          </Text>
        </View>
      ) : null}

      <View className="pr-20">
        <Text
          className="text-[18px] font-bold leading-6"
          style={{ color: ui.text }}
        >
          {plan.title}
        </Text>

        <View className="mt-1 flex-row items-baseline">
          <Text
            className="text-[25px] font-extrabold leading-8"
            style={{ color: ui.text }}
          >
            {plan.price}
          </Text>

          <Text
            className="ml-1 text-[12px] leading-5"
            style={{ color: ui.text }}
          >
            {plan.period}
          </Text>
        </View>

        <Text
          className={`mt-1 text-[12px] leading-5 ${
            isYearly ? "font-bold" : "font-normal"
          }`}
          style={{ color: isYearly ? ui.primaryDark : ui.muted }}
        >
          {plan.tagline}
        </Text>
      </View>

      <View className="mt-4 gap-2">
        {plan.features.map((feature) => (
          <FeatureItem key={feature}>{feature}</FeatureItem>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        className="mt-5 h-[46px] items-center justify-center rounded-[10px]"
        disabled={disabled}
        onPress={(event) => {
          event.stopPropagation();
          onSubscribe();
        }}
        style={{
          backgroundColor: disabled
            ? ui.disabled
            : isYearly
              ? ui.orangeDark
              : ui.primaryDark,
        }}
      >
        <Text
          className="text-[13px] font-bold leading-5"
          style={{ color: disabled ? "#475569" : "#FFFFFF" }}
        >
          {buttonLabel}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <Text
        className="text-center text-[12px] font-bold leading-5"
        style={{ color: value === "20%" ? ui.primaryDark : ui.muted }}
      >
        {value}
      </Text>
    );
  }

  return (
    <Feather
      color={value ? ui.primaryDark : ui.danger}
      name={value ? "check" : "x"}
      size={15}
    />
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
  return (
    <View
      className="flex-row items-center border-b py-[14px]"
      style={{ borderColor: "#E8ECEA" }}
    >
      <Text
        className="min-w-0 flex-[1.7] text-[12px] leading-[18px]"
        style={{ color: ui.text }}
      >
        {feature}
      </Text>

      <View className="flex-1 items-center">
        <CellValue value={basic} />
      </View>

      <View className="flex-1 items-center">
        <CellValue value={monthly} />
      </View>

      <View className="flex-1 items-center">
        <CellValue value={yearly} />
      </View>
    </View>
  );
}

function ComparisonTable() {
  return (
    <View className="pt-2">
      <Text
        className="mb-8 text-center text-[14px] leading-5"
        style={{ color: ui.text }}
      >
        So sánh tính năng
      </Text>

      <View
        className="flex-row border-b pb-3"
        style={{ borderColor: ui.border }}
      >
        <Text
          className="flex-[1.7] text-[12px] font-bold uppercase leading-4"
          style={{ color: ui.text }}
        >
          Tính năng
        </Text>

        <Text
          className="flex-1 text-center text-[12px] font-bold uppercase leading-4"
          style={{ color: ui.text }}
        >
          Cơ bản
        </Text>

        <Text
          className="flex-1 text-center text-[12px] font-bold uppercase leading-4"
          style={{ color: ui.text }}
        >
          Tháng
        </Text>

        <Text
          className="flex-1 text-center text-[12px] font-bold uppercase leading-4"
          style={{ color: ui.text }}
        >
          Năm
        </Text>
      </View>

      <ComparisonRow basic={false} feature="Không quảng cáo" monthly yearly />

      <ComparisonRow
        basic={false}
        feature="Tăng số lượt tư vấn AI"
        monthly
        yearly
      />

      <ComparisonRow basic={false} feature="Phân tích sâu" monthly yearly />

      <ComparisonRow
        basic={false}
        feature="Ăn uống cá nhân hóa & theo dõi dài hạn"
        monthly
        yearly
      />

      <ComparisonRow
        basic={false}
        feature="Hỗ trợ ưu tiên"
        monthly={false}
        yearly
      />

      <ComparisonRow
        basic="—"
        feature="Tiết kiệm chi phí"
        monthly="—"
        yearly="20%"
      />

      <Text
        className="px-4 pt-6 text-center text-[10px] italic leading-[16px]"
        style={{ color: ui.muted }}
      >
        Bạn có thể hủy gói đăng ký bất cứ lúc nào trong phần cài đặt tài khoản.
      </Text>
    </View>
  );
}

function Footer() {
  return (
    <View className="items-center pt-1">
      <View className="flex-row items-center gap-1">
        <Feather color={ui.primaryDark} name="lock" size={12} />

        <Text
          className="text-center text-[12px] font-semibold leading-5"
          style={{ color: ui.primaryDark }}
        >
          Thanh toán an toàn & bảo mật qua cổng nội địa
        </Text>
      </View>

      <View className="mt-20 items-center gap-3">
        <Text
          className="text-center text-[12px] leading-5"
          style={{ color: ui.muted }}
        >
          Chính sách bảo mật Điều khoản dịch vụ
        </Text>

        <Text
          className="text-center text-[12px] leading-5"
          style={{ color: ui.muted }}
        >
          Trung tâm trợ giúp
        </Text>

        <Text
          className="px-8 pt-2 text-center text-[12px] leading-5"
          style={{ color: ui.muted }}
        >
          © 2026 Nutelyt AI. Đã mã hóa thanh toán bảo mật.
        </Text>
      </View>
    </View>
  );
}

export function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlanId>("monthly");

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/profile" as Href);
  };

  const goToSuccess = (planId: SubscriptionPlanId) => {
    setSelectedPlanId(planId);

    router.push({
      pathname: "/subscription/success",
      params: { planId },
    } as unknown as Href);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: ui.background,
        paddingTop: insets.top,
      }}
    >
      <Header onBack={goBack} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 18,
          paddingBottom: Math.max(insets.bottom + 28, 64),
          paddingHorizontal: 18,
          paddingTop: 24,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <HeroCard />

        <View className="gap-2.5">
          {subscriptionPlans.map((plan) => (
            <PlanCard
              isSelected={selectedPlanId === plan.id}
              key={plan.id}
              onSelect={() => setSelectedPlanId(plan.id)}
              onSubscribe={() => {
                if (plan.isCurrent) {
                  return;
                }

                goToSuccess(plan.id);
              }}
              plan={plan}
            />
          ))}
        </View>

        <ComparisonTable />

        <Footer />
      </ScrollView>
    </View>
  );
}
