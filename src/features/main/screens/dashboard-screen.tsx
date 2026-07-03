import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

import { dashboardMock, type DashboardFoodEntry, type DashboardMacro, type DashboardWarning } from '../data/mock-dashboard';
import type { RouteProfileParams } from '../types';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

const cardShadow = { boxShadow: '0 4px 10px rgba(0, 105, 109, 0.05)' };
const greenShadow = { boxShadow: '0 8px 24px rgba(39, 174, 96, 0.15)' };
const aiImage = require('../../../../assets/images/Nutelyt-AI.png');
const wordmarkImage = require('../../../../assets/images/Nutelyt-text.png');

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="h-[56px] flex-row items-center bg-background px-5">
      <Pressable accessibilityLabel="Quay lại" accessibilityRole="button" className="h-12 w-12 items-start justify-center" onPress={onBack}>
        <Feather color={colors.primaryDark} name="arrow-left" size={20} />
      </Pressable>
      <View className="flex-row items-center gap-1">
        <Image accessibilityIgnoresInvertColors resizeMode="contain" source={wordmarkImage} style={{ height: 30, width: 76 }} />
        <Text className="text-xl font-bold leading-7 text-primary-700">phân tích</Text>
      </View>
    </View>
  );
}

function InsightCard() {
  return (
    <View className="flex-row gap-3 rounded-[12px] border border-[#E1E3E4] bg-card p-[17px]" style={cardShadow}>
      <View className="mt-1 h-6 w-6 items-center justify-center rounded-full bg-primary-50">
        <Feather color={colors.primaryDark} name="zap" size={13} />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-primary-700">AI Insight tuần này</Text>
        <Text className="text-sm leading-5 text-foreground">{dashboardMock.insight}</Text>
      </View>
    </View>
  );
}

function MacroRow({ macro }: { macro: DashboardMacro }) {
  return (
    <View className="h-[54px] flex-row items-center justify-between rounded-[12px] border border-[#BCCABC] bg-card px-[13px]">
      <View className="flex-row items-center gap-2">
        <View className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }} />
        <Text className="text-xs font-semibold leading-4 tracking-[0.6px] text-[#3D4A3F]">{macro.label}</Text>
      </View>
      <Text className="text-sm font-semibold leading-5 text-foreground">{macro.value}</Text>
    </View>
  );
}

function SummaryCards() {
  return (
    <View className="flex-row gap-3">
      <View className="min-h-[170px] flex-1 justify-between overflow-hidden rounded-[20px] bg-primary-600 p-4" style={greenShadow}>
        <View className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/15" />
        <View className="gap-1 pt-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.6px] text-[#00391A]/80">Trung bình calo</Text>
          <Text className="pt-1 text-[24px] font-semibold leading-8 text-[#00391A]">{dashboardMock.calories.average}</Text>
          <Text className="text-sm leading-5 text-[#00391A]/90">{dashboardMock.calories.unit}</Text>
        </View>
        <View className="self-start rounded-[8px] bg-white/20 px-2 py-1">
          <Text className="text-xs font-semibold leading-4 text-[#00391A]">{dashboardMock.calories.delta}</Text>
        </View>
      </View>
      <View className="flex-1 gap-1">
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
    <View className="flex-row items-center justify-between rounded-[20px] border border-[#E1E3E4] bg-card p-[17px]">
      <View className="gap-1">
        <Text className="text-xl font-semibold leading-7 text-foreground">{dashboardMock.consistency.days}</Text>
        <Text className="text-sm leading-5 text-[#3D4A3F]">{dashboardMock.consistency.label}</Text>
      </View>
      <View className="h-16 w-16 items-center justify-center rounded-full border-[6px] border-primary-100">
        <View className="absolute h-16 w-16 rounded-full border-[6px] border-r-primary-600 border-t-primary-600 border-b-transparent border-l-transparent" />
        <Text className="text-base font-bold leading-6 text-primary-700">{progress}%</Text>
      </View>
    </View>
  );
}

function WarningCard({ warning, onPress }: { warning: DashboardWarning; onPress?: () => void }) {
  const danger = warning.tone === 'danger';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      className={`flex-row gap-3 rounded-[16px] p-3 ${danger ? 'bg-[#FFDAD666]' : 'bg-[#D9843733]'}`}
      onPress={onPress}
    >
      <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-white/45">
        <Feather color={danger ? '#93000A' : '#904D00'} name={danger ? 'alert-triangle' : 'alert-circle'} size={15} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className={`text-xs font-bold leading-4 tracking-[0.6px] ${danger ? 'text-[#93000A]' : 'text-[#4D2700]'}`}>
          {warning.title}
        </Text>
        <Text className={`text-sm leading-5 ${danger ? 'text-[#93000A]/80' : 'text-[#4D2700]/80'}`}>{warning.message}</Text>
      </View>
      {onPress ? <Feather color="#93000A" name="chevron-right" size={18} /> : null}
    </Pressable>
  );
}

function HealthWarnings({ onOpenDetail }: { onOpenDetail: () => void }) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-semibold leading-7 text-foreground">Cảnh báo sức khỏe tuần này</Text>
      <View className="gap-2">
        {dashboardMock.warnings.map((warning) => (
          <WarningCard key={warning.id} onPress={warning.id === 'sodium' ? onOpenDetail : undefined} warning={warning} />
        ))}
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[10px] leading-[15px] text-[#3D4A3F]">{label}</Text>
    </View>
  );
}

function WeeklyChart() {
  const maxValue = Math.max(...dashboardMock.chart.flatMap((day) => [day.carb, day.protein, day.fat]));
  const barHeight = (value: number) => Math.max((value / maxValue) * 108, 16);

  return (
    <View className="gap-3 rounded-[20px] border border-[#E1E3E4] bg-card p-[21px]" style={cardShadow}>
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold leading-7 text-foreground">Theo dõi dinh dưỡng 7 ngày</Text>
        <View className="flex-row gap-2">
          <LegendDot color="#FBBC04" label="Carb" />
          <LegendDot color="#27AE60" label="Protein" />
          <LegendDot color="#EF4444" label="Fat" />
        </View>
      </View>
      <View className="h-[150px] flex-row items-end justify-between rounded-[12px] bg-[#F8F9FA] px-2 pb-5 pt-4">
        {dashboardMock.chart.map((day) => (
          <View className="items-center gap-2" key={day.day}>
            <View className="h-[112px] flex-row items-end gap-1">
              <View className="w-2 rounded-t-full bg-[#FBBC04]" style={{ height: barHeight(day.carb) }} />
              <View className="w-2 rounded-t-full bg-[#27AE60]" style={{ height: barHeight(day.protein) }} />
              <View className="w-2 rounded-t-full bg-[#EF4444]" style={{ height: barHeight(day.fat) }} />
            </View>
            <Text className="text-[10px] font-semibold leading-[15px] text-[#6D7A6E]">{day.day}</Text>
          </View>
        ))}
      </View>
      <View className="rounded-[8px] border border-[#BCCABC] bg-[#EDEEEF] p-[13px]">
        <Text className="text-xs leading-[19px] text-[#3D4A3F]">{dashboardMock.chartNote}</Text>
      </View>
    </View>
  );
}

function FoodGroups() {
  return (
    <View className="gap-2">
      <Text className="text-xl font-semibold leading-7 text-foreground">Nhóm thực phẩm dùng nhiều</Text>
      <View className="flex-row flex-wrap gap-2">
        {dashboardMock.foodGroups.map((group) => (
          <View className="flex-row items-center gap-1 rounded-full border border-[#E1E3E4] bg-[#EDEEEF] px-[13px] py-[7px]" key={group.id}>
            <Feather color="#006D37" name={group.icon as never} size={13} />
            <Text className="text-xs font-semibold leading-4 tracking-[0.6px] text-foreground">
              {group.label} ({group.count})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function tagClass(tone: DashboardFoodEntry['tags'][number]['tone']) {
  if (tone === 'danger') {
    return 'bg-[#FFDAD680] text-[#93000A]';
  }
  if (tone === 'success') {
    return 'bg-primary-100 text-[#00391A]';
  }
  return 'bg-[#EDEEEF] text-[#3D4A3F]';
}

function DiaryCard({ entry }: { entry: DashboardFoodEntry }) {
  return (
    <View className="gap-3 rounded-[16px] border border-[#E1E3E4] bg-card p-[17px]">
      <View className="flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-600">
          <Text className="text-xs font-bold leading-4 text-[#00391A]">{entry.day}</Text>
        </View>
        <Text className="text-xs font-semibold leading-4 tracking-[0.6px] text-[#6D7A6E]">{entry.date}</Text>
      </View>
      <View className="flex-row gap-3">
        <Image accessibilityIgnoresInvertColors className="h-16 w-16 rounded-[12px]" resizeMode="cover" source={entry.image} />
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-sm font-semibold leading-5 text-foreground">{entry.title}</Text>
          <View className="flex-row flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <View className={`rounded-[4px] px-2 py-0.5 ${tagClass(tag.tone).split(' ')[0]}`} key={tag.label}>
                <Text className={`text-[10px] leading-[15px] ${tagClass(tag.tone).split(' ')[1]}`}>{tag.label}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row items-center gap-1 pt-1">
            <Feather color="#00696D" name="map-pin" size={11} />
            <Text className="flex-1 text-xs leading-4 text-[#00696D]">{entry.suggestion}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FoodDiary() {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold leading-7 text-foreground">Nhật ký món ăn 7 ngày</Text>
        <Text className="text-xs font-semibold uppercase leading-4 tracking-[0.6px] text-primary-700">Xem tất cả</Text>
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
    <View className="overflow-hidden rounded-[20px] border border-primary-700/20 bg-[#DDF5EA] p-[21px]">
      <View className="gap-2 pr-16">
        <View className="flex-row items-center gap-2">
          <Feather color={colors.primaryDark} name="star" size={19} />
          <Text className="text-xl font-semibold leading-7 text-primary-700">AI Nutelyt gợi ý</Text>
        </View>
        <Text className="text-sm leading-5 text-foreground">{dashboardMock.aiAdvice}</Text>
        <Pressable accessibilityRole="button" className="mt-2 h-11 items-center justify-center rounded-full bg-primary-700">
          <Text className="text-xs font-semibold leading-4 tracking-[0.6px] text-white">Xem thực đơn đề xuất</Text>
        </Pressable>
      </View>
      <Image accessibilityIgnoresInvertColors resizeMode="contain" source={aiImage} style={{ bottom: -4, height: 82, position: 'absolute', right: -2, width: 82 }} />
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
    router.replace({ pathname: '/home', params: { profile: profileParam } } as unknown as Href);
  };

  const openWarningDetail = () => {
    router.push({ pathname: '/dashboard/warning-detail', params: { profile: profileParam } } as unknown as Href);
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
