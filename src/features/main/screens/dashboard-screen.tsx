import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../components/app-header';
import { BottomTabBar } from '../components/bottom-tab-bar';
import { HealthProfileCard } from '../components/health-profile-card';
import { QuickActionCard } from '../components/quick-action-card';
import { QuickScanBubble } from '../components/quick-scan-bubble';
import { RecentScanCard } from '../components/recent-scan-card';
import { mockFoods } from '../data/mock-foods';
import type { RouteProfileParams } from '../types';
import { getFirstName, parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

export function DashboardScreen() {
  const params = useLocalSearchParams<RouteProfileParams>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const cards = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 260, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
      Animated.stagger(
        70,
        cards.map((card) =>
          Animated.spring(card, { damping: 18, stiffness: 150, toValue: 1, useNativeDriver: true })
        )
      ),
    ]).start();
  }, [cards, opacity, translateY]);

  const animatedStyle = (index: number) => ({
    opacity: cards[index],
    transform: [
      {
        translateY: cards[index].interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  });

  const navigate = (pathname: string, foodId?: string) => {
    router.push({
      pathname,
      params: { profile: profileParam, ...(foodId ? { foodId } : {}) },
    } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <AppHeader />
      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: 16,
            paddingBottom: Math.max(insets.bottom + 152, 176),
            paddingHorizontal: 20,
            paddingTop: 24,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View className="gap-4" style={animatedStyle(0)}>
            <View>
              <Text className="text-[28px] font-semibold leading-9 text-foreground">
                Chào mừng, {getFirstName(profile.fullName)}
              </Text>
              <Text className="text-base leading-6 text-muted">
                Stay on track with your dietary goals.
              </Text>
            </View>
            <HealthProfileCard
              onEdit={() => navigate('/profile')}
              profile={profile}
            />
          </Animated.View>

          <Animated.View className="gap-2" style={animatedStyle(1)}>
            <Text className="text-[20px] font-semibold leading-7 text-foreground">Nhu cầu sử dụng</Text>
            <View className="flex-row gap-4">
              <QuickActionCard label="Ăn ngoài" />
              <QuickActionCard label="Tự chế biến" />
            </View>
            <View className="flex-row gap-4">
              <QuickActionCard label="Nấu cho gia đình" />
              <QuickActionCard label="Quét sản phẩm" onPress={() => navigate('/scan')} />
            </View>
          </Animated.View>

          <Animated.View className="gap-3" style={animatedStyle(2)}>
            <View className="flex-row items-center justify-between">
              <Text className="text-[20px] font-semibold leading-7 text-foreground">
                Lịch sử quét sản phẩm
              </Text>
              <Pressable accessibilityRole="button" onPress={() => navigate('/scan-history')}>
                <Text className="text-sm font-semibold leading-5 text-primary-700">Xem tất cả</Text>
              </Pressable>
            </View>
            <View className="gap-3">
              {mockFoods.slice(1, 4).map((food) => (
                <RecentScanCard
                  food={food}
                  key={food.id}
                  onPress={() => navigate('/analysis-result', food.id)}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View className="rounded-[12px] bg-primary-50 p-4" style={animatedStyle(3)}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-600">
                <Feather color="#FFFFFF" name="zap" size={18} />
              </View>
              <Text className="flex-1 text-sm leading-5 text-primary-700">
                Dữ liệu hiện là mẫu frontend để mô phỏng trải nghiệm quét và phân tích.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>

      <QuickScanBubble onPress={() => navigate('/scan')} />
      <BottomTabBar active="home" profileParam={profileParam} />
    </View>
  );
}
