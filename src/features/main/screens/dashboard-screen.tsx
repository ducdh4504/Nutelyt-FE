import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { parseHealthProfileParam, serializeProfile } from "@/src/features/health-profile/utils/health-profile";
import type { RouteProfileParams } from "@/src/features/profile/profile.types";

import {
  dashboardMock,
  type DashboardFoodEntry,
  type DashboardMacro,
  type DashboardWarning,
} from "../data/mock-dashboard";

const dashboardColors = {
  background: "#F6F8F7",
  card: "#FFFFFF",
  border: "#E3E8E4",

  text: "#17231B",
  mutedText: "#6B756E",

  primary: "#22C55E",
  primaryDark: "#15803D",
  primarySoft: "#DCFCE7",

  warningRedBg: "#FEE2E2",
  warningRedText: "#B91C1C",

  warningOrangeBg: "#FFF3D7",
  warningOrangeText: "#B45309",

  carb: "#FACC15",
  protein: "#22C55E",
  fat: "#EF4444",

  chipBg: "#F1F5F2",
  chartBg: "#F8FAF8",
};

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

const greenShadow = {
  shadowColor: dashboardColors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 18,
  elevation: 4,
};

const aiImage = require("../../../../assets/images/Nutelyt-AI.png");

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View
      className="h-[54px] flex-row items-center px-4"
      style={{ backgroundColor: dashboardColors.background }}
    >
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-11 w-10 items-start justify-center"
        onPress={onBack}
      >
        <Feather
          color={dashboardColors.primaryDark}
          name="arrow-left"
          size={20}
        />
      </Pressable>

      <Text
        className="text-lg font-bold leading-7"
        style={{ color: dashboardColors.primaryDark }}
      >
        phân tích
      </Text>
    </View>
  );
}

function InsightCard() {
  return (
    <View
      className="flex-row gap-3 rounded-[14px] border p-4"
      style={[
        cardShadow,
        {
          backgroundColor: dashboardColors.card,
          borderColor: dashboardColors.border,
        },
      ]}
    >
      <View
        className="mt-0.5 h-6 w-6 items-center justify-center rounded-full"
        style={{ backgroundColor: dashboardColors.primarySoft }}
      >
        <Feather color={dashboardColors.primaryDark} name="zap" size={13} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-[11px] font-bold uppercase leading-4 tracking-[0.5px]"
          style={{ color: dashboardColors.primaryDark }}
        >
          AI Insight tuần này
        </Text>

        <Text
          className="mt-1 text-[13px] leading-5"
          style={{ color: dashboardColors.text }}
        >
          {dashboardMock.insight}
        </Text>
      </View>
    </View>
  );
}

function MacroRow({ macro }: { macro: DashboardMacro }) {
  const macroColor = macro.label.toLowerCase().includes("carb")
    ? dashboardColors.carb
    : macro.label.toLowerCase().includes("protein")
      ? dashboardColors.protein
      : dashboardColors.fat;

  return (
    <View
      className="h-[49px] flex-row items-center justify-between rounded-[12px] border px-3"
      style={{
        backgroundColor: dashboardColors.card,
        borderColor: dashboardColors.border,
      }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: macro.color || macroColor }}
        />

        <Text
          className="text-[11px] font-semibold leading-4"
          style={{ color: dashboardColors.text }}
        >
          {macro.label}
        </Text>
      </View>

      <Text
        className="text-xs font-bold leading-4"
        style={{ color: dashboardColors.text }}
      >
        {macro.value}
      </Text>
    </View>
  );
}

function SummaryCards() {
  return (
    <View className="flex-row gap-2.5">
      <View
        className="min-h-[160px] flex-1 justify-between overflow-hidden rounded-[18px] p-4"
        style={[
          greenShadow,
          {
            backgroundColor: dashboardColors.primary,
          },
        ]}
      >
        <View className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/20" />
        <View className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />

        <View>
          <Text className="text-[11px] font-bold uppercase leading-4 tracking-[0.5px] text-white/80">
            Trung bình calo
          </Text>

          <Text className="mt-2 text-[28px] font-bold leading-9 text-white">
            {dashboardMock.calories.average}
          </Text>

          <Text className="text-xs font-medium leading-5 text-white/90">
            {dashboardMock.calories.unit}
          </Text>
        </View>

        <View className="self-start rounded-full bg-white/20 px-3 py-1.5">
          <Text className="text-[11px] font-bold leading-4 text-white">
            {dashboardMock.calories.delta}
          </Text>
        </View>
      </View>

      <View className="flex-1 gap-2">
        {dashboardMock.macros.map((macro) => (
          <MacroRow key={macro.id} macro={macro} />
        ))}
      </View>
    </View>
  );
}

function ProgressCard() {
  const progress = dashboardMock.consistency.progress;

  return (
    <View
      className="flex-row items-center justify-between rounded-[18px] border p-4"
      style={[
        cardShadow,
        {
          backgroundColor: dashboardColors.card,
          borderColor: dashboardColors.border,
        },
      ]}
    >
      <View>
        <Text
          className="text-xl font-bold leading-7"
          style={{ color: dashboardColors.text }}
        >
          {dashboardMock.consistency.days}
        </Text>

        <Text
          className="mt-0.5 text-[13px] leading-5"
          style={{ color: dashboardColors.mutedText }}
        >
          {dashboardMock.consistency.label}
        </Text>
      </View>

      <View
        className="h-[58px] w-[58px] items-center justify-center rounded-full border-[6px]"
        style={{ borderColor: dashboardColors.primarySoft }}
      >
        <View
          className="absolute h-[58px] w-[58px] rounded-full border-[6px] border-b-transparent border-l-transparent"
          style={{
            borderRightColor: dashboardColors.primary,
            borderTopColor: dashboardColors.primary,
          }}
        />

        <Text
          className="text-sm font-bold leading-5"
          style={{ color: dashboardColors.primaryDark }}
        >
          {progress}%
        </Text>
      </View>
    </View>
  );
}

function WarningCard({
  warning,
  onPress,
}: {
  warning: DashboardWarning;
  onPress?: () => void;
}) {
  const danger = warning.tone === "danger";

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      className="flex-row gap-3 rounded-[14px] p-3"
      style={{
        backgroundColor: danger
          ? dashboardColors.warningRedBg
          : dashboardColors.warningOrangeBg,
      }}
      onPress={onPress}
    >
      <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-white/60">
        <Feather
          color={
            danger
              ? dashboardColors.warningRedText
              : dashboardColors.warningOrangeText
          }
          name={danger ? "alert-triangle" : "alert-circle"}
          size={14}
        />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-xs font-bold leading-4"
          style={{
            color: danger
              ? dashboardColors.warningRedText
              : dashboardColors.warningOrangeText,
          }}
        >
          {warning.title}
        </Text>

        <Text
          className="mt-0.5 text-[12px] leading-[18px]"
          style={{
            color: danger
              ? dashboardColors.warningRedText
              : dashboardColors.warningOrangeText,
            opacity: 0.85,
          }}
        >
          {warning.message}
        </Text>
      </View>

      {onPress ? (
        <Feather
          color={
            danger
              ? dashboardColors.warningRedText
              : dashboardColors.warningOrangeText
          }
          name="chevron-right"
          size={17}
        />
      ) : null}
    </Pressable>
  );
}

function HealthWarnings({ onOpenDetail }: { onOpenDetail: () => void }) {
  return (
    <View className="gap-2.5">
      <Text
        className="text-lg font-bold leading-7"
        style={{ color: dashboardColors.text }}
      >
        Cảnh báo sức khỏe tuần này
      </Text>

      <View className="gap-2">
        {dashboardMock.warnings.map((warning) => (
          <WarningCard
            key={warning.id}
            onPress={warning.id === "sodium" ? onOpenDetail : undefined}
            warning={warning}
          />
        ))}
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <View
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />

      <Text
        className="text-[10px] leading-[14px]"
        style={{ color: dashboardColors.mutedText }}
      >
        {label}
      </Text>
    </View>
  );
}

function WeeklyChart() {
  const maxValue = Math.max(
    ...dashboardMock.chart.flatMap((day) => [day.carb, day.protein, day.fat]),
  );

  const barHeight = (value: number) => Math.max((value / maxValue) * 102, 12);

  return (
    <View
      className="rounded-[18px] border p-4"
      style={[
        cardShadow,
        {
          backgroundColor: dashboardColors.card,
          borderColor: dashboardColors.border,
        },
      ]}
    >
      <View className="flex-col items-start justify-between">
        <Text
          className="flex-1 text-lg font-bold leading-7"
          style={{ color: dashboardColors.text }}
        >
          Theo dõi dinh dưỡng 7 ngày
        </Text>

        <View className="mt-1 flex-row gap-2">
          <LegendDot color={dashboardColors.carb} label="Carb" />
          <LegendDot color={dashboardColors.protein} label="Protein" />
          <LegendDot color={dashboardColors.fat} label="Fat" />
        </View>
      </View>

      <View
        className="mt-3 h-[145px] flex-row items-end justify-between rounded-[12px] px-2 pb-4 pt-3"
        style={{ backgroundColor: dashboardColors.chartBg }}
      >
        {dashboardMock.chart.map((day) => (
          <View className="items-center gap-1.5" key={day.day}>
            <View className="h-[106px] flex-row items-end gap-1">
              <View
                className="w-1.5 rounded-t-full"
                style={{
                  backgroundColor: dashboardColors.carb,
                  height: barHeight(day.carb),
                }}
              />

              <View
                className="w-1.5 rounded-t-full"
                style={{
                  backgroundColor: dashboardColors.protein,
                  height: barHeight(day.protein),
                }}
              />

              <View
                className="w-1.5 rounded-t-full"
                style={{
                  backgroundColor: dashboardColors.fat,
                  height: barHeight(day.fat),
                }}
              />
            </View>

            <Text
              className="text-[10px] font-semibold leading-[14px]"
              style={{
                color:
                  day.day === "T5"
                    ? dashboardColors.primaryDark
                    : dashboardColors.mutedText,
              }}
            >
              {day.day}
            </Text>
          </View>
        ))}
      </View>

      <View
        className="mt-3 rounded-[10px] border p-3"
        style={{
          backgroundColor: "#F3F5F4",
          borderColor: dashboardColors.border,
        }}
      >
        <Text
          className="text-[11px] leading-[18px]"
          style={{ color: dashboardColors.mutedText }}
        >
          {dashboardMock.chartNote}
        </Text>
      </View>
    </View>
  );
}

function FoodGroups() {
  return (
    <View className="gap-2.5">
      <Text
        className="text-lg font-bold leading-7"
        style={{ color: dashboardColors.text }}
      >
        Nhóm thực phẩm dùng nhiều
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {dashboardMock.foodGroups.map((group) => (
          <View
            className="flex-row items-center gap-1.5 rounded-full border px-3 py-1.5"
            key={group.id}
            style={{
              backgroundColor: dashboardColors.chipBg,
              borderColor: dashboardColors.border,
            }}
          >
            <Feather
              color={dashboardColors.primaryDark}
              name={group.icon as never}
              size={12}
            />

            <Text
              className="text-[11px] font-semibold leading-4"
              style={{ color: dashboardColors.text }}
            >
              {group.label} ({group.count})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function getTagStyle(tone: DashboardFoodEntry["tags"][number]["tone"]) {
  if (tone === "danger") {
    return {
      backgroundColor: "#FEE2E2",
      color: dashboardColors.warningRedText,
    };
  }

  if (tone === "success") {
    return {
      backgroundColor: dashboardColors.primarySoft,
      color: dashboardColors.primaryDark,
    };
  }

  return {
    backgroundColor: "#EEF2F0",
    color: dashboardColors.mutedText,
  };
}

function DiaryCard({ entry }: { entry: DashboardFoodEntry }) {
  return (
    <View
      className="rounded-[16px] border p-3"
      style={[
        cardShadow,
        {
          backgroundColor: dashboardColors.card,
          borderColor: dashboardColors.border,
        },
      ]}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: dashboardColors.primary }}
        >
          <Text className="text-[11px] font-bold leading-4 text-white">
            {entry.day}
          </Text>
        </View>

        <Text
          className="text-[11px] font-semibold leading-4"
          style={{ color: dashboardColors.mutedText }}
        >
          {entry.date}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-3">
        <Image
          accessibilityIgnoresInvertColors
          className="h-16 w-16 rounded-[12px]"
          contentFit="cover"
          source={entry.image}
        />

        <View className="min-w-0 flex-1">
          <Text
            className="text-sm font-bold leading-5"
            style={{ color: dashboardColors.text }}
          >
            {entry.title}
          </Text>

          <View className="mt-1 flex-row flex-wrap gap-1">
            {entry.tags.map((tag) => {
              const tagStyle = getTagStyle(tag.tone);

              return (
                <View
                  className="rounded-[5px] px-2 py-0.5"
                  key={tag.label}
                  style={{ backgroundColor: tagStyle.backgroundColor }}
                >
                  <Text
                    className="text-[10px] font-medium leading-[14px]"
                    style={{ color: tagStyle.color }}
                  >
                    {tag.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="mt-2 flex-row items-center gap-1">
            <Feather
              color={dashboardColors.primaryDark}
              name="map-pin"
              size={11}
            />

            <Text
              className="flex-1 text-[11px] leading-4"
              style={{ color: dashboardColors.primaryDark }}
            >
              {entry.suggestion}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FoodDiary() {
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <Text
          className="text-lg font-bold leading-7"
          style={{ color: dashboardColors.text }}
        >
          Nhật ký món ăn 7 ngày
        </Text>

        <Text
          className="text-[11px] font-bold uppercase leading-4 tracking-[0.5px]"
          style={{ color: dashboardColors.primaryDark }}
        >
          Xem tất cả
        </Text>
      </View>

      <View className="gap-3">
        {dashboardMock.diary.map((entry) => (
          <DiaryCard entry={entry} key={entry.id} />
        ))}
      </View>
    </View>
  );
}

function AISuggestionCard() {
  return (
    <View
      className="overflow-hidden rounded-[20px] border p-4"
      style={{
        backgroundColor: "#DDF5EA",
        borderColor: "#B7E7CC",
      }}
    >
      <View className="pr-[70px]">
        <View className="flex-row items-center gap-2">
          <Feather color={dashboardColors.primaryDark} name="star" size={18} />

          <Text
            className="text-lg font-bold leading-7"
            style={{ color: dashboardColors.primaryDark }}
          >
            AI Nutelyt gợi ý
          </Text>
        </View>

        <Text
          className="mt-1.5 text-[13px] leading-5"
          style={{ color: dashboardColors.text }}
        >
          {dashboardMock.aiAdvice}
        </Text>

        <Pressable
          accessibilityRole="button"
          className="mt-3 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: dashboardColors.primaryDark }}
        >
          <Text className="text-[11px] font-bold leading-4 tracking-[0.4px] text-white">
            Xem thực đơn đề xuất
          </Text>
        </Pressable>
      </View>

      <Image
        accessibilityIgnoresInvertColors
        contentFit="contain"
        source={aiImage}
        style={{
          bottom: -3,
          height: 78,
          position: "absolute",
          right: -2,
          width: 78,
        }}
      />
    </View>
  );
}

export function DashboardScreen() {
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

    router.replace({
      pathname: "/home",
      params: { profile: profileParam },
    } as unknown as Href);
  };

  const openWarningDetail = () => {
    router.push({
      pathname: "/dashboard/warning-detail",
      params: { profile: profileParam },
    } as unknown as Href);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: dashboardColors.background,
        paddingTop: insets.top,
      }}
    >
      <Header onBack={goBack} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: Math.max(insets.bottom + 28, 56),
          paddingHorizontal: 16,
          paddingTop: 10,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <InsightCard />
        <SummaryCards />
        <ProgressCard />
        <HealthWarnings onOpenDetail={openWarningDetail} />
        <WeeklyChart />
        <FoodGroups />
        <FoodDiary />
        <AISuggestionCard />
      </ScrollView>
    </View>
  );
}
