import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSubscriptionPlan } from "../data/subscription-plans";

const wordmarkImage = require("../../../../assets/images/Nutelyt-text.png");
const mascotImage = require("../../../../assets/images/Nutelyt-AI.png");

const ui = {
  background: "#F7F8FC",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E2E8E4",

  primary: "#27AE60",
  primaryDark: "#169B54",
  primarySoft: "#EAF8F1",

  footerBg: "#F3F4F6",
};

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

const successShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.16,
  shadowRadius: 16,
  elevation: 5,
};

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View
      className="h-[58px] flex-row items-center justify-between px-5"
      style={{ backgroundColor: ui.background }}
    >
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-11 w-11 items-start justify-center"
        onPress={onBack}
      >
        <Feather color="#334155" name="chevron-left" size={24} />
      </Pressable>

      <View
        className="absolute left-0 right-0 items-center"
        pointerEvents="none"
      >
        <Image
          accessibilityLabel="Nutelyt"
          className="h-[30px] w-[108px]"
          contentFit="contain"
          source={wordmarkImage}
        />

        <Text
          className="-mt-1 text-[10px] font-semibold leading-3"
          style={{ color: "#8CB99F" }}
        >
          Sẵn sàng hỗ trợ bạn!
        </Text>
      </View>

      <View className="h-11 w-11" />
    </View>
  );
}

function formatDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");

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

function DateSummary({
  icon,
  label,
  value,
}: {
  icon: "calendar" | "clock";
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Feather color={ui.primary} name={icon} size={22} />

      <View className="min-w-0 flex-1">
        <Text
          className="text-[11px] font-semibold uppercase leading-[13px]"
          style={{ color: "#7A8580" }}
        >
          {label}
        </Text>

        <Text
          className="text-[12px] font-bold leading-[15px]"
          style={{ color: "#6B756E" }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function SuccessIcon() {
  return (
    <View
      className="h-[100px] w-[100px] items-center justify-center rounded-full"
      style={[
        successShadow,
        {
          backgroundColor: ui.primary,
        },
      ]}
    >
      <Feather color="#FFFFFF" name="check" size={48} />
    </View>
  );
}

function PackageInfoCard({
  periodLabel,
  planTitle,
  price,
  renewalDate,
  startDate,
}: {
  periodLabel: string;
  planTitle: string;
  price: string;
  renewalDate: string;
  startDate: string;
}) {
  return (
    <View
      className="rounded-[16px] border px-6 py-6"
      style={[
        cardShadow,
        {
          backgroundColor: ui.card,
          borderColor: ui.border,
        },
      ]}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="text-[15px] font-medium uppercase leading-5 tracking-[1px]"
            style={{ color: ui.primary }}
          >
            THÔNG TIN GÓI
          </Text>

          <Text
            className="mt-3 text-[16px] leading-6"
            style={{ color: ui.text }}
          >
            {planTitle}
          </Text>
        </View>

        <View
          className="rounded-full px-4 py-1.5"
          style={{ backgroundColor: "#D9F4E5" }}
        >
          <Text
            className="text-[11px] font-bold leading-4"
            style={{ color: ui.primaryDark }}
          >
            Đang hoạt động
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-baseline gap-1">
        <Text
          className="text-[16px] font-medium leading-6"
          style={{ color: ui.primary }}
        >
          {price}
        </Text>

        <Text className="text-[16px] leading-6" style={{ color: "#68766E" }}>
          {periodLabel}
        </Text>
      </View>

      <View
        className="my-6 h-px"
        style={{ backgroundColor: "rgba(188, 203, 185, 0.45)" }}
      />

      <View className="flex-row justify-between gap-5">
        <DateSummary icon="calendar" label="Ngày bắt đầu" value={startDate} />
        <DateSummary icon="clock" label="Ngày gia hạn" value={renewalDate} />
      </View>
    </View>
  );
}

function PremiumActivatedCard() {
  return (
    <View
      className="flex-row items-center gap-5 rounded-[16px] border px-6 py-6"
      style={{
        backgroundColor: "#EEF9F6",
        borderColor: "#D6EFE5",
      }}
    >
      <Image
        accessibilityIgnoresInvertColors
        className="h-[78px] w-[78px] rounded-full border-2"
        contentFit="cover"
        source={mascotImage}
        style={{ borderColor: ui.primary }}
      />

      <View className="min-w-0 flex-1">
        <Text
          className="text-[16px] font-medium leading-6"
          style={{ color: ui.primary }}
        >
          Tuyệt vời!
        </Text>

        <View className="mt-1 flex-row items-start gap-1.5">
          <Feather color={ui.primary} name="award" size={16} />

          <Text
            className="min-w-0 flex-1 text-[14px] leading-5"
            style={{ color: "#4CC47C" }}
          >
            Đã kích hoạt toàn bộ tính năng VIP
          </Text>
        </View>
      </View>
    </View>
  );
}

function ActionButtons({
  onMealPlan,
  onHome,
}: {
  onMealPlan: () => void;
  onHome: () => void;
}) {
  return (
    <View className="gap-4 pt-8">
      <Pressable
        accessibilityRole="button"
        className="h-[58px] flex-row items-center justify-center gap-2 rounded-[10px]"
        onPress={onHome}
        style={[
          successShadow,
          {
            backgroundColor: ui.primary,
          },
        ]}
      >
        <Feather color="#FFFFFF" name="home" size={18} />

        <Text className="text-[16px] font-bold leading-6 text-white">
          Về trang chủ
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        className="h-[60px] flex-row items-center justify-center gap-2 rounded-[10px] border-2"
        onPress={onMealPlan}
        style={{
          backgroundColor: ui.background,
          borderColor: ui.primary,
        }}
      >
        <Feather color={ui.primaryDark} name="shuffle" size={20} />

        <Text
          className="text-[16px] font-bold leading-6"
          style={{ color: ui.primaryDark }}
        >
          Xem kế hoạch bữa ăn của bạn
        </Text>
      </Pressable>
    </View>
  );
}

function Footer() {
  return (
    <View
      className="items-center border-t px-5 pb-8 pt-8"
      style={{
        backgroundColor: ui.footerBg,
        borderColor: "#D1D5DB",
      }}
    >
      <Text
        className="text-center text-[14px] leading-6"
        style={{ color: "#7B8580" }}
      >
        Chính sách bảo mật Điều khoản dịch vụ
      </Text>

      <Text
        className="mt-4 text-center text-[14px] leading-6"
        style={{ color: "#7B8580" }}
      >
        Trung tâm trợ giúp
      </Text>

      <Text
        className="mt-7 px-3 text-center text-[14px] leading-6"
        style={{ color: "#7B8580" }}
      >
        © 2026 Nutelyt AI. Đã mã hóa thanh toán bảo mật.
      </Text>
    </View>
  );
}

export function SubscriptionSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ planId?: string | string[] }>();

  const plan = useMemo(
    () => getSubscriptionPlan(params.planId),
    [params.planId],
  );

  const periodLabel = plan.period.trim();

  const startDate = useMemo(() => new Date(), []);

  const renewalDate = useMemo(
    () => addBillingPeriod(startDate, plan.id === "yearly"),
    [plan.id, startDate],
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/subscription" as Href);
  };

  const goHome = () => {
    router.replace("/home" as Href);
  };

  const goMealPlan = () => {
    router.replace("/home" as Href);
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
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 28,
          }}
        >
          <View className="items-center">
            <SuccessIcon />

            <Text
              className="mt-6 text-center text-[16px] leading-6"
              style={{ color: ui.text }}
            >
              Thanh toán thành công!
            </Text>

            <Text
              className="mt-2 text-center text-[16px] leading-6"
              style={{ color: "#4B5563" }}
            >
              Chào mừng bạn gia nhập cộng đồng Premium
            </Text>
          </View>

          <View className="mt-8">
            <PackageInfoCard
              periodLabel={periodLabel}
              planTitle={plan.title}
              price={plan.price}
              renewalDate={formatDate(renewalDate)}
              startDate={formatDate(startDate)}
            />
          </View>

          <View className="mt-6">
            <PremiumActivatedCard />
          </View>

          <ActionButtons onHome={goHome} onMealPlan={goMealPlan} />
        </View>

        <View style={{ height: 26 }} />

        <Footer />
      </ScrollView>
    </View>
  );
}
