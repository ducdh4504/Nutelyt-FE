// import { Feather } from '@expo/vector-icons';
// import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
// import { useEffect, useMemo, useRef } from 'react';
// import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { AppHeader } from '../components/app-header';
// import { BottomTabBar } from '../components/bottom-tab-bar';
// import { HealthProfileCard } from '../components/health-profile-card';
// import { QuickActionCard } from '../components/quick-action-card';
// import { QuickScanBubble } from '../components/quick-scan-bubble';
// import { RecentScanCard } from '../components/recent-scan-card';
// import { mockFoods } from '../data/mock-foods';
// import type { RouteProfileParams } from '../types';
// import { getFirstName, parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

// export function DashboardScreen() {
//   const params = useLocalSearchParams<RouteProfileParams>();
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const profile = useMemo(() => parseHealthProfileParam(params), [params]);
//   const profileParam = useMemo(() => serializeProfile(profile), [profile]);
//   const opacity = useRef(new Animated.Value(0)).current;
//   const translateY = useRef(new Animated.Value(14)).current;
//   const cards = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(opacity, { duration: 260, toValue: 1, useNativeDriver: true }),
//       Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
//       Animated.stagger(
//         70,
//         cards.map((card) =>
//           Animated.spring(card, { damping: 18, stiffness: 150, toValue: 1, useNativeDriver: true })
//         )
//       ),
//     ]).start();
//   }, [cards, opacity, translateY]);

//   const animatedStyle = (index: number) => ({
//     opacity: cards[index],
//     transform: [
//       {
//         translateY: cards[index].interpolate({
//           inputRange: [0, 1],
//           outputRange: [16, 0],
//         }),
//       },
//     ],
//   });

//   const navigate = (pathname: string, foodId?: string) => {
//     router.push({
//       pathname,
//       params: { profile: profileParam, ...(foodId ? { foodId } : {}) },
//     } as unknown as Href);
//   };

//   return (
//     <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
//       <AppHeader />
//       <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
//         <ScrollView
//           className="flex-1"
//           contentContainerStyle={{
//             gap: 16,
//             paddingBottom: Math.max(insets.bottom + 152, 176),
//             paddingHorizontal: 20,
//             paddingTop: 24,
//           }}
//           contentInsetAdjustmentBehavior="automatic"
//           showsVerticalScrollIndicator={false}
//         >
//           <Animated.View className="gap-4" style={animatedStyle(0)}>
//             <View>
//               <Text className="text-[28px] font-semibold leading-9 text-foreground">
//                 Chào mừng, {getFirstName(profile.fullName)}
//               </Text>
//               <Text className="text-base leading-6 text-muted">
//                 Stay on track with your dietary goals.
//               </Text>
//             </View>
//             <HealthProfileCard
//               onEdit={() => navigate('/profile')}
//               profile={profile}
//             />
//           </Animated.View>

//           <Animated.View className="gap-2" style={animatedStyle(1)}>
//             <Text className="text-[20px] font-semibold leading-7 text-foreground">Nhu cầu sử dụng</Text>
//             <View className="flex-row gap-4">
//               <QuickActionCard label="Ăn ngoài" />
//               <QuickActionCard label="Tự chế biến" />
//             </View>
//             <View className="flex-row gap-4">
//               <QuickActionCard label="Nấu cho gia đình" />
//               <QuickActionCard label="Quét sản phẩm" onPress={() => navigate('/scan')} />
//             </View>
//           </Animated.View>

//           <Animated.View className="gap-3" style={animatedStyle(2)}>
//             <View className="flex-row items-center justify-between">
//               <Text className="text-[20px] font-semibold leading-7 text-foreground">
//                 Lịch sử quét sản phẩm
//               </Text>
//               <Pressable accessibilityRole="button" onPress={() => navigate('/scan-history')}>
//                 <Text className="text-sm font-semibold leading-5 text-primary-700">Xem tất cả</Text>
//               </Pressable>
//             </View>
//             <View className="gap-3">
//               {mockFoods.slice(1, 4).map((food) => (
//                 <RecentScanCard
//                   food={food}
//                   key={food.id}
//                   onPress={() => navigate('/analysis-result', food.id)}
//                 />
//               ))}
//             </View>
//           </Animated.View>

//           <Animated.View className="rounded-[12px] bg-primary-50 p-4" style={animatedStyle(3)}>
//             <View className="flex-row items-center gap-3">
//               <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-600">
//                 <Feather color="#FFFFFF" name="zap" size={18} />
//               </View>
//               <Text className="flex-1 text-sm leading-5 text-primary-700">
//                 Dữ liệu hiện là mẫu frontend để mô phỏng trải nghiệm quét và phân tích.
//               </Text>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </Animated.View>

//       <QuickScanBubble onPress={() => navigate('/scan')} />
//       <BottomTabBar active="home" profileParam={profileParam} />
//     </View>
//   );
// }

import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

import { BottomTabBar } from '../components/bottom-tab-bar';
import type { FeatherName, RouteProfileParams } from '../types';
import { getProfileFallback, parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

type FoodRecommendation = {
  id: string;
  name: string;
  description: string;
  icon: FeatherName;
  tint: string;
  iconColor: string;
};

const foodRecommendations: FoodRecommendation[] = [
  {
    id: 'honey-grilled-chicken',
    name: 'Ức gà nướng mật ong',
    description: 'Giàu protein - ít béo',
    icon: 'coffee',
    tint: '#EAF7EF',
    iconColor: '#15803D',
  },
  {
    id: 'com-tam',
    name: 'Cơm tấm',
    description: 'Dinh dưỡng',
    icon: 'grid',
    tint: '#FFF7E6',
    iconColor: '#B45309',
  },
  {
    id: 'salmon-salad',
    name: 'Salad cá hồi',
    description: 'Giàu vitamin - tiêu hóa tốt',
    icon: 'droplet',
    tint: '#E8F4FF',
    iconColor: '#0369A1',
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

function RecommendationCard({ item, style }: { item: FoodRecommendation; style: object }) {
  return (
    <Animated.View
      className="min-h-[88px] flex-row items-center rounded-[8px] border border-[#E5EEE7] bg-card px-4 py-4"
      style={[cardShadow, style]}
    >
      <View
        className="h-14 w-14 items-center justify-center rounded-[8px] border border-white"
        style={{ backgroundColor: item.tint }}
      >
        <Feather color={item.iconColor} name={item.icon} size={24} />
      </View>

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
      <View className="h-4 bg-background" />

      <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom + 112, 136),
            paddingHorizontal: 20,
            paddingTop: 0,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8">
            <View className="gap-8">
              <View>
                <Text className="text-[28px] font-semibold leading-9 text-foreground">
                  Chào mừng, {greetingName}
                </Text>
                <Text className="text-base leading-6 text-muted">Hôm nay bạn muốn ăn gì?</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-[70px] overflow-hidden rounded-[8px] bg-primary-600 px-5"
                onPress={() => navigate('/scan')}
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