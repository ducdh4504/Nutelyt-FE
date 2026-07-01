import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

import { BottomTabBar } from '../components/bottom-tab-bar';
import type { RouteProfileParams } from '../types';
import { getProfileFallback, parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

type FoodRecommendation = {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType;
};

const foodRecommendations: FoodRecommendation[] = [
  {
    id: 'honey-grilled-chicken',
    name: 'Ức gà nướng mật ong',
    description: 'Giàu protein - ít béo',
    image: require('../../../../assets/images/Food/Uc-ga-mat-ong.png'),
  },
  {
    id: 'com-tam',
    name: 'Cơm tấm',
    description: 'Dinh dưỡng',
    image: require('../../../../assets/images/Food/Com-tam.png'),
  },
  {
    id: 'salmon-salad',
    name: 'Salad cá hồi',
    description: 'Giàu vitamin - tiêu hóa tốt',
    image: require('../../../../assets/images/Food/Salad-ca-hoi.png'),
  },
];

const cardShadow = {
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.06)',
};

const ctaShadow = {
  boxShadow: '0 16px 34px rgba(39, 174, 96, 0.24)',
};

function getGreetingName(fullName: string) {
  const fallbackName = getProfileFallback().fullName;
  const trimmed = fullName.trim();

  if (!trimmed || trimmed === fallbackName) {
    return 'bạn';
  }

  return trimmed;
}

function getAvatarInitial(name: string) {
  const trimmed = name.trim();

  if (!trimmed || trimmed === 'bạn') {
    return 'N';
  }

  return trimmed
    .split(/\s+/)
    .at(-1)
    ?.charAt(0)
    .toLocaleUpperCase('vi-VN') ?? 'N';
}

function RecommendationCard({ item, style }: { item: FoodRecommendation; style: object }) {
  return (
    <Animated.View
      className="min-h-[88px] flex-row items-center rounded-[8px] border border-[#E5EEE7] bg-card px-4 py-4"
      style={[cardShadow, style]}
    >
      <Image
        accessibilityIgnoresInvertColors
        className="h-14 w-14 rounded-[8px]"
        resizeMode="cover"
        source={item.image}
      />

      <View className="ml-4 flex-1 gap-1 pr-3">
        <Text className="text-base font-semibold leading-6 text-foreground">{item.name}</Text>
        <Text className="text-sm leading-5 text-muted">{item.description}</Text>
      </View>

      <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-50">
        <Feather color={colors.primaryDark} name="check" size={16} />
      </View>
    </Animated.View>
  );
}

export function DashboardScreen() {
  const params = useLocalSearchParams<RouteProfileParams>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const cards = useRef(Array.from({ length: foodRecommendations.length }, () => new Animated.Value(0))).current;
  const greetingName = getGreetingName(profile.fullName);
  const avatarInitial = getAvatarInitial(greetingName);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 220, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
      Animated.stagger(
        70,
        cards.map((card) =>
          Animated.spring(card, { damping: 18, stiffness: 150, toValue: 1, useNativeDriver: true })
        )
      ),
    ]).start();
  }, [cards, opacity, translateY]);

  const animatedCardStyle = (index: number) => ({
    opacity: cards[index],
    transform: [
      {
        translateY: cards[index].interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  });

  const navigate = (pathname: string) => {
    router.push({
      pathname,
      params: { profile: profileParam },
    } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom + 112, 136),
            paddingHorizontal: 20,
            paddingTop: 24,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8">
            <View className="gap-8">
              <View className="min-h-[60px] flex-row items-start justify-between gap-4">
                <View className="min-w-0 flex-1">
                  <Text className="text-[28px] font-semibold leading-9 text-foreground">
                    Chào mừng, {greetingName}
                  </Text>
                  <Text className="text-base leading-6 text-muted">Hôm nay bạn muốn ăn gì?</Text>
                </View>

                <Pressable
                  accessibilityLabel="Mở hồ sơ"
                  accessibilityRole="button"
                  className="h-16 w-16 items-center justify-center rounded-full bg-primary-50"
                  onPress={() => navigate('/profile')}
                  style={cardShadow}
                >
                  <Text className="text-[24px] font-bold leading-8 text-primary-700">{avatarInitial}</Text>
                  <View className="absolute bottom-1 right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary-600">
                    <Feather color="#FFFFFF" name="check" size={11} />
                  </View>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-[70px] overflow-hidden rounded-[8px] bg-primary-600 px-5"
                onPress={() => navigate('/chat-ai')}
                style={ctaShadow}
              >
                <View className="absolute -right-7 -top-16 h-32 w-32 rounded-full bg-white/15" />
                <View className="h-full flex-row items-center justify-center gap-3">
                  <Feather color="#FFFFFF" name="message-circle" size={20} />
                  <Text className="text-center text-base font-semibold leading-6 text-white">
                    Trò chuyện với trợ lý dinh dưỡng
                  </Text>
                </View>
              </Pressable>
            </View>

            <View className="gap-5">
              <View className="flex-row items-center justify-between">
                <View className="max-w-[220px]">
                  <Text className="text-[20px] font-semibold leading-7 text-foreground">
                    Gợi ý món ăn cho bạn
                  </Text>
                  <Text className="text-sm leading-5 text-muted">Dựa trên tình trạng sức khỏe</Text>
                </View>
                <Pressable accessibilityRole="button" onPress={() => navigate('/scan-history')}>
                  <Text className="text-sm font-semibold leading-5 text-primary-700">Xem tất cả</Text>
                </Pressable>
              </View>

              <View className="gap-3">
                {foodRecommendations.map((item, index) => (
                  <RecommendationCard item={item} key={item.id} style={animatedCardStyle(index)} />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <BottomTabBar active="home" profileParam={profileParam} />
    </View>
  );
}
