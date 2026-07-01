import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Animated, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

import { BottomTabBar } from '../components/bottom-tab-bar';
import type { RouteProfileParams } from '../types';
import { parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

type HistoryStatus = 'Đã xem' | 'Đã lưu';

type HistoryItem = {
  id: string;
  title: string;
  status: HistoryStatus;
  time: string;
  image: ImageSourcePropType;
};

type HistorySection = {
  title: string;
  data: HistoryItem[];
};

const historySections: HistorySection[] = [
  {
    title: 'Hôm nay',
    data: [
      {
        id: 'bun-bo-lanh-manh',
        title: 'Bún bò lành mạnh',
        status: 'Đã xem',
        time: '10:32AM',
        image: require('../../../../assets/images/Food/Bun-bo.png'),
      },
      {
        id: 'goi-y-3-mon-giam-can',
        title: 'Bữa ăn Việt Nam 3 món',
        status: 'Đã xem',
        time: '09:15AM',
        image: require('../../../../assets/images/Food/Bua-an-3-mon.png'),
      },
      {
        id: 'uc-ga-nuong-mat-ong',
        title: 'Ức gà nướng mật ong',
        status: 'Đã lưu',
        time: '08:20AM',
        image: require('../../../../assets/images/Food/Uc-ga-mat-ong.png'),
      },
    ],
  },
  {
    title: 'Hôm qua',
    data: [
      {
        id: 'com-tam-suon-bi-cha',
        title: 'Cơm tấm sườn bì chả',
        status: 'Đã xem',
        time: '15:45PM',
        image: require('../../../../assets/images/Food/Com-tam.png'),
      },
      {
        id: 'salad-ca-hoi',
        title: 'Salad cá hồi',
        status: 'Đã xem',
        time: '17:22PM',
        image: require('../../../../assets/images/Food/Salad-ca-hoi.png'),
      },
    ],
  },
  {
    title: '2 ngày trước',
    data: [
      {
        id: 'goi-y-mon-an-tap-gym',
        title: 'Gợi ý món ăn tập gym',
        status: 'Đã xem',
        time: '18:30PM',
        image: require('../../../../assets/images/Food/Mon-an-tap-gym.png'),
      },
    ],
  },
];

const cardShadow = {
  boxShadow: '0 10px 24px rgba(0, 0, 0, 0.06)',
};

const ctaShadow = {
  boxShadow: '0 14px 28px rgba(39, 174, 96, 0.22)',
};

function HistoryCard({ item, style }: { item: HistoryItem; style: object }) {
  return (
    <Animated.View style={style}>
      <Pressable
        accessibilityRole="button"
        className="min-h-[110px] flex-row items-center rounded-[12px] bg-card px-5 py-5"
        onPress={() => undefined}
        style={cardShadow}
      >
        <Image
          accessibilityIgnoresInvertColors
          className="h-[72px] w-[72px] rounded-[12px]"
          resizeMode="cover"
          source={item.image}
        />

        <View className="ml-4 min-w-0 flex-1 gap-2 pr-2">
          <Text className="text-base font-semibold leading-6 text-foreground" numberOfLines={2}>
            {item.title}
          </Text>
          <View className="self-start rounded-full bg-primary-50 px-3 py-1">
            <Text className="text-xs font-semibold leading-4 text-primary-700">{item.status}</Text>
          </View>
        </View>

        <Text className="text-xs font-medium leading-4 text-muted">{item.time}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function ScanHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteProfileParams>();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const [query, setQuery] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 240, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi-VN');

    if (!normalizedQuery) {
      return historySections;
    }

    return historySections
      .map((section) => ({
        ...section,
        data: section.data.filter((item) => item.title.toLocaleLowerCase('vi-VN').includes(normalizedQuery)),
      }))
      .filter((section) => section.data.length > 0);
  }, [query]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
  };

  const goDashboard = () => {
    router.push({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="h-[64px] flex-row items-center bg-background px-5">
        <Pressable
          accessibilityLabel="Quay lại"
          accessibilityRole="button"
          className="h-11 w-11 items-start justify-center"
          onPress={goBack}
        >
          <Feather color={colors.primaryDark} name="chevron-left" size={24} />
        </Pressable>
        <Text className="flex-1 pr-11 text-center text-[20px] font-bold leading-7 text-foreground">
          Lịch sử tìm kiếm
        </Text>
      </View>

      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: 24,
            paddingBottom: Math.max(insets.bottom + 184, 208),
            paddingHorizontal: 20,
            paddingTop: 8,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-14 flex-1 flex-row items-center rounded-[12px] bg-card px-4"
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <Feather color="#6B7280" name="search" size={18} />
              <TextInput
                className="ml-3 flex-1 text-base leading-6 text-foreground"
                onChangeText={setQuery}
                placeholder="Tìm kiếm cuộc trò chuyện..."
                placeholderTextColor="#6B7280"
                value={query}
              />
            </View>
            <Pressable
              accessibilityLabel="Bộ lọc"
              accessibilityRole="button"
              className="h-14 w-14 items-center justify-center rounded-[12px] bg-card"
              onPress={() => undefined}
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <Feather color={colors.primaryDark} name="sliders" size={20} />
            </Pressable>
          </View>

          {filteredSections.map((section, sectionIndex) => (
            <View className="gap-3" key={section.title}>
              <Text className="text-sm font-semibold leading-5 text-muted">{section.title}</Text>
              <View className="gap-4">
                {section.data.map((item, itemIndex) => (
                  <HistoryCard
                    item={item}
                    key={item.id}
                    style={{
                      opacity,
                      transform: [{ translateY: sectionIndex === 0 && itemIndex < 3 ? translateY : 0 }],
                    }}
                  />
                ))}
              </View>
            </View>
          ))}

          {filteredSections.length === 0 ? (
            <View className="items-center rounded-[12px] bg-card p-6" style={cardShadow}>
              <Text className="text-center text-base leading-6 text-muted">Không tìm thấy lịch sử phù hợp.</Text>
            </View>
          ) : null}
        </ScrollView>
      </Animated.View>

      <View
        className="absolute left-0 right-0 border-t border-[#E5EEE7] bg-background px-8 pt-4"
        style={{ bottom: Math.max(insets.bottom + 74, 84), paddingBottom: 12 }}
      >
        <Pressable
          accessibilityRole="button"
          className="h-16 items-center justify-center rounded-[18px] bg-primary-600"
          onPress={goDashboard}
          style={ctaShadow}
        >
          <Text className="text-base font-bold leading-6 text-white">Xem Dashboard 7 ngày</Text>
        </Pressable>
      </View>

      <BottomTabBar active="history" profileParam={profileParam} />
    </View>
  );
}
