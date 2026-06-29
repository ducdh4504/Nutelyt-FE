import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAnalysisCard } from '../components/ai-analysis-card';
import { AppHeader } from '../components/app-header';
import { BottomTabBar } from '../components/bottom-tab-bar';
import { NutritionCard } from '../components/nutrition-card';
import { getFoodById } from '../data/mock-foods';
import type { RouteProfileParams } from '../types';
import {
  getAIAnalysisCopy,
  getAnalysisWarnings,
  getFoodStatusForProfile,
  getStatusLabel,
} from '../utils/analysis-summary';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

function tone(status: 'safe' | 'warning' | 'avoid') {
  if (status === 'safe') {
    return { bg: 'bg-primary-50', color: '#27AE60', icon: 'check-circle' as const };
  }
  if (status === 'avoid') {
    return { bg: 'bg-[#FFDAD6]', color: '#BA1A1A', icon: 'alert-circle' as const };
  }
  return { bg: 'bg-[#FFDCC3]', color: '#904D00', icon: 'alert-triangle' as const };
}

export function AnalysisResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteProfileParams>();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const foodId = Array.isArray(params.foodId) ? params.foodId[0] : params.foodId;
  const food = useMemo(() => getFoodById(foodId), [foodId]);
  const status = getFoodStatusForProfile(profile, food);
  const statusTone = tone(status);
  const warnings = useMemo(() => getAnalysisWarnings(profile, food), [food, profile]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 260, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <AppHeader
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
          }
        }}
        rightIcon="share-2"
      />
      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: 28,
            paddingBottom: Math.max(insets.bottom + 128, 152),
            paddingHorizontal: 20,
            paddingTop: 24,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <View
              className="flex-row items-center gap-4 rounded-[12px] border border-[#E2E2E5] bg-card p-[25px]"
              style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.06)' }}
            >
              <View className="h-24 w-24 rounded-[8px] bg-[#EEEEF0]" />
              <View className="gap-1">
                <Text className="text-sm font-semibold uppercase tracking-[0.7px] text-[#006492]">
                  {food.category}
                </Text>
                <Text className="text-[24px] font-semibold leading-8 text-foreground">{food.name}</Text>
              </View>
            </View>

            <View
              className="items-center justify-center rounded-[12px] border border-[#E2E2E5] bg-card p-[25px]"
              style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.06)' }}
            >
              <View className={`absolute right-4 top-4 flex-row items-center gap-1 rounded-full px-3 py-1 ${statusTone.bg}`}>
                <Feather color={statusTone.color} name={statusTone.icon} size={15} />
                <Text className="text-sm font-semibold" style={{ color: statusTone.color }}>
                  {getStatusLabel(status)}
                </Text>
              </View>
              <View className="h-32 w-32 items-center justify-center rounded-full bg-background">
                <Text className="text-[40px] font-bold leading-10 text-foreground">{food.score}</Text>
                <Text className="text-sm font-semibold leading-5 text-muted">/ 100</Text>
              </View>
              <Text className="text-sm font-semibold leading-5 text-muted">Điểm phù hợp</Text>
            </View>
          </View>

          <View className="gap-4">
            <Text className="px-1 text-[20px] font-semibold leading-7 text-foreground">
              Phân tích sức khỏe
            </Text>
            {warnings.map((warning) => {
              const warningTone =
                warning.tone === 'danger'
                  ? { bg: 'bg-[#FFDAD64D]', border: 'border-[#FFDAD6]', color: '#93000A', icon: 'alert-triangle' as const }
                  : warning.tone === 'warning'
                    ? { bg: 'bg-[#FFDCC3]', border: 'border-[#FFBE7A]', color: '#904D00', icon: 'alert-triangle' as const }
                    : { bg: 'bg-[#F3F3F6]', border: 'border-[#BCCABC4D]', color: '#005228', icon: 'check-circle' as const };
              return (
                <View
                  className={`flex-row gap-4 rounded-[12px] border p-[17px] ${warningTone.bg} ${warningTone.border}`}
                  key={warning.title}
                >
                  <Feather color={warningTone.color} name={warningTone.icon} size={22} />
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-sm font-semibold leading-5" style={{ color: warningTone.color }}>
                      {warning.title}
                    </Text>
                    <Text className="text-base leading-6 text-muted">{warning.body}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <NutritionCard nutrition={food.nutrition} />

          <AIAnalysisCard
            body={getAIAnalysisCopy(profile, food)}
            chips={['Thông tin tham khảo', 'Dựa trên hồ sơ cục bộ', ...food.tags.slice(0, 1)]}
          />

          <View className="gap-4">
            <Text className="px-1 text-[20px] font-semibold leading-7 text-foreground">
              Gợi ý lựa chọn thay thế
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4 pr-5">
                {food.alternatives.map((item) => (
                  <View
                    className="w-[220px] gap-2 rounded-[12px] border border-[#E2E2E5] bg-card p-[17px]"
                    key={item.name}
                    style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.06)' }}
                  >
                    <View className="h-32 rounded-[8px] bg-[#EEEEF0]" />
                    <Text className="text-sm font-semibold leading-5 text-primary-700">
                      {item.score}/100 Score
                    </Text>
                    <Text className="text-base font-bold leading-6 text-foreground">{item.name}</Text>
                    <Text className="text-sm font-semibold leading-5 text-muted">{item.note}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </Animated.View>
      <BottomTabBar active="scan" profileParam={profileParam} />
    </View>
  );
}
