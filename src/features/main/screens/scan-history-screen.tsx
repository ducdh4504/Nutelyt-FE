import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../components/app-header';
import { BottomTabBar } from '../components/bottom-tab-bar';
import { HistoryFilterTabs, type HistoryFilter } from '../components/history-filter-tabs';
import { HistoryFoodCard } from '../components/history-food-card';
import { mockFoods } from '../data/mock-foods';
import type { RouteProfileParams } from '../types';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

export function ScanHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteProfileParams>();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 260, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const foods = useMemo(
    () => (filter === 'all' ? mockFoods.slice(2) : mockFoods.filter((food) => food.status === filter)),
    [filter]
  );

  const openFood = (foodId: string) => {
    router.push({
      pathname: '/analysis-result',
      params: { profile: profileParam, foodId },
    } as unknown as Href);
  };

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
        rightIcon="more-vertical"
      />
      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: 28,
            paddingBottom: Math.max(insets.bottom + 128, 152),
            paddingHorizontal: 20,
            paddingTop: 16,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <View
              className="h-14 flex-row items-center gap-3 rounded-[12px] bg-card px-[18px]"
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <Feather color="#6B7280" name="search" size={18} />
              <Text className="text-base text-[#6B7280]">Nhập món ăn bạn muốn ăn hôm nay</Text>
            </View>
            <HistoryFilterTabs active={filter} onChange={setFilter} />
          </View>

          <View className="gap-4">
            <Text className="text-sm font-semibold uppercase leading-5 tracking-[0.7px] text-muted">
              Quét gần đây
            </Text>
            {foods.map((food, index) => (
              <Animated.View
                key={food.id}
                style={{
                  opacity,
                  transform: [{ translateY: index < 4 ? translateY : 0 }],
                }}
              >
                <HistoryFoodCard food={food} onPress={() => openFood(food.id)} />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
      <BottomTabBar active="history" profileParam={profileParam} />
    </View>
  );
}
