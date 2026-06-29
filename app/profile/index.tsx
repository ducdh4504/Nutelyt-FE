import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

type HealthProfileSummary = {
  fullName: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  purpose: string | string[];
  diseases: string[];
  goal: string;
  diet: string | null;
};

type DietSummaryChip = {
  id: string;
  label: string;
  tone?: 'danger' | 'success';
};

type FeatherName = ComponentProps<typeof Feather>['name'];

const fallbackProfile: HealthProfileSummary = {
  fullName: 'Người dùng Nutelyt',
  age: '--',
  gender: '--',
  height: '--',
  weight: '--',
  purpose: '',
  diseases: [],
  goal: '',
  diet: null,
};

const cardShadow = { boxShadow: '0 12px 28px rgba(45, 156, 219, 0.08)' };
const smallShadow = { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function safeText(value: unknown, fallback = '--') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parseProfileParam(profileParam: string | undefined): HealthProfileSummary {
  if (!profileParam) {
    return fallbackProfile;
  }

  try {
    const parsed = JSON.parse(profileParam) as Partial<HealthProfileSummary>;

    return {
      fullName: safeText(parsed.fullName, fallbackProfile.fullName),
      age: safeText(parsed.age),
      gender: safeText(parsed.gender),
      height: safeText(parsed.height),
      weight: safeText(parsed.weight),
      purpose: Array.isArray(parsed.purpose)
        ? parsed.purpose.filter((item): item is string => typeof item === 'string')
        : safeText(parsed.purpose, ''),
      diseases: Array.isArray(parsed.diseases)
        ? parsed.diseases.filter((item): item is string => typeof item === 'string')
        : [],
      goal: safeText(parsed.goal, ''),
      diet: typeof parsed.diet === 'string' && parsed.diet.trim() ? parsed.diet.trim() : null,
    };
  } catch {
    return fallbackProfile;
  }
}

function parseNumeric(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function calculateBMI(heightCm: string, weightKg: string) {
  const height = parseNumeric(heightCm);
  const weight = parseNumeric(weightKg);

  if (!height || !weight) {
    return null;
  }

  return weight / Math.pow(height / 100, 2);
}

function getBMILabel(bmi: number) {
  if (bmi < 18.5) {
    return 'Thiếu cân';
  }
  if (bmi < 23) {
    return 'Bình thường';
  }
  if (bmi < 25) {
    return 'Tiền béo phì';
  }
  return 'Thừa cân';
}

function normalizeToken(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function hasToken(values: string[], ids: string[], words: string[]) {
  return values.some((value) => {
    const normalized = normalizeToken(value);
    return ids.includes(value) || words.some((word) => normalized.includes(word));
  });
}

function buildDietSummaryChips(profile: HealthProfileSummary): DietSummaryChip[] {
  const chips: DietSummaryChip[] = [];
  const addChip = (id: string, label: string, tone: DietSummaryChip['tone'] = 'success') => {
    if (!chips.some((chip) => chip.id === id)) {
      chips.push({ id, label, tone });
    }
  };

  if (hasToken(profile.diseases, ['diabetes'], ['tieu duong', 'diabetes'])) {
    addChip('limit-sugar', 'Hạn chế đường');
  }
  if (hasToken(profile.diseases, ['pressure', 'hypertension'], ['tang huyet ap', 'hypertension'])) {
    addChip('limit-salt', 'Hạn chế muối');
  }
  if (
    hasToken(profile.diseases, ['fat', 'dyslipidemia'], [
      'roi loan mo mau',
      'dyslipidemia',
      'mo mau',
    ])
  ) {
    addChip('limit-fat', 'Hạn chế dầu mỡ');
  }

  const diet = normalizeToken(profile.diet ?? '');
  if (diet.includes('keto') || diet.includes('low-carb') || diet.includes('giam tinh bot')) {
    addChip('low-carb', 'Ít tinh bột');
  }
  if (diet.includes('vegan') || diet.includes('vegetarian') || diet.includes('chay')) {
    addChip('vegetarian', 'Ăn chay');
  }

  const goal = normalizeToken(profile.goal);
  if (profile.goal === 'loss' || goal.includes('giam can') || goal.includes('weight loss')) {
    addChip('calorie-deficit', 'Thâm hụt calo');
  }
  if (profile.goal === 'muscle' || goal.includes('tang co') || goal.includes('muscle')) {
    addChip('protein', 'Tăng protein');
  }

  return chips.length ? chips : [{ id: 'pending', label: 'Hồ sơ đang chờ cập nhật' }];
}

function formatMeasurement(value: string, unit: string) {
  const numeric = parseNumeric(value);
  if (!numeric) {
    return '--';
  }

  const display = Number.isInteger(numeric) ? numeric.toFixed(0) : numeric.toString();
  return `${display}${unit}`;
}

function formatAgeGender(profile: HealthProfileSummary) {
  const age = profile.age === '--' ? '--' : `${profile.age} tuổi`;
  return `${age} / ${profile.gender || '--'}`;
}

function CardShell({
  children,
  className = '',
  delayStyle,
}: {
  children: ReactNode;
  className?: string;
  delayStyle?: object;
}) {
  return (
    <Animated.View
      className={`rounded-[12px] border border-white/70 bg-white/90 p-[21px] ${className}`}
      style={[cardShadow, delayStyle]}
    >
      {children}
    </Animated.View>
  );
}

function SectionTitle({
  color = colors.primaryDark,
  icon,
  title,
}: {
  color?: string;
  icon: FeatherName;
  title: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Feather color={color} name={icon} size={17} />
      <Text className="text-[20px] font-semibold leading-7 text-foreground">{title}</Text>
    </View>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-[8px] border border-border bg-background p-[13px]">
      <Text className="text-xs uppercase leading-[18px] text-[#6D7A6E]">{label}</Text>
      <Text className="text-[18px] font-bold leading-7 text-foreground">{value}</Text>
    </View>
  );
}

function SummaryChip({ chip }: { chip: DietSummaryChip }) {
  const danger = chip.tone === 'danger';
  return (
    <View
      className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
        danger ? 'bg-[#FFDAD6]' : 'bg-primary-50'
      }`}
    >
      {danger ? <Feather color="#93000A" name="alert-triangle" size={14} /> : null}
      <Text className={`text-base leading-6 ${danger ? 'text-[#93000A]' : 'text-primary-700'}`}>
        {chip.label}
      </Text>
    </View>
  );
}

function BottomTabItem({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: FeatherName;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !active, selected: active }}
      className={`min-w-[72px] flex-1 items-center justify-center gap-1 rounded-[12px] py-2 ${
        active ? 'bg-primary-600' : ''
      }`}
      disabled={!active}
    >
      <Feather color={active ? '#00391A' : '#3D4A3F'} name={icon} size={18} />
      <Text
        className={`text-center text-xs font-semibold leading-4 ${
          active ? 'text-[#00391A]' : 'text-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ProfileRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ profile?: string | string[] }>();
  const [saved, setSaved] = useState(false);
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(14)).current;
  const saveScale = useRef(new Animated.Value(1)).current;
  const cardProgress = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  const profile = useMemo(() => parseProfileParam(firstParam(params.profile)), [params.profile]);
  const profileParam = useMemo(() => JSON.stringify(profile), [profile]);
  const bmi = useMemo(() => calculateBMI(profile.height, profile.weight), [profile.height, profile.weight]);
  const bmiText = bmi ? `${bmi.toFixed(1)} (${getBMILabel(bmi)})` : '--';
  const chips = useMemo(() => buildDietSummaryChips(profile), [profile]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        duration: 260,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(screenTranslate, {
        damping: 18,
        stiffness: 150,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.stagger(
        70,
        cardProgress.map((value) =>
          Animated.spring(value, {
            damping: 18,
            stiffness: 150,
            toValue: 1,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [cardProgress, screenOpacity, screenTranslate]);

  useEffect(() => {
    if (!saved) {
      return;
    }
    const timeout = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(timeout);
  }, [saved]);

  const cardStyle = (index: number) => ({
    opacity: cardProgress[index],
    transform: [
      {
        translateY: cardProgress[index].interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/health-profile' as Href);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center bg-background px-5" style={smallShadow}>
          <Pressable
            accessibilityLabel="Quay lại"
            accessibilityRole="button"
            className="h-12 w-12 items-start justify-center"
            onPress={goBack}
          >
            <Feather color={colors.primaryDark} name="arrow-left" size={20} />
          </Pressable>
          <Text className="flex-1 pr-12 text-center font-bold text-primary-700">Nutelyt</Text>
        </View>

        <Animated.View
          className="flex-1"
          style={{ opacity: screenOpacity, transform: [{ translateY: screenTranslate }] }}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              gap: 32,
              paddingBottom: Math.max(insets.bottom + 184, 204),
              paddingHorizontal: 20,
              paddingTop: 24,
            }}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-2">
              <Text className="text-center text-[28px] font-semibold leading-9 text-foreground">
                Xem lại hồ sơ của bạn
              </Text>
              <Text className="text-base leading-6 text-muted">
                Vui lòng kiểm tra và xác nhận thông tin để hỗ trợ AI mang đến trải nghiệm cá nhân
                hóa với độ chính xác theo tiêu chuẩn lâm sàng.
              </Text>
            </View>

            <View className="gap-4">
              <CardShell delayStyle={cardStyle(0)}>
                <View className="gap-4">
                  <SectionTitle icon="user" title="Thông tin cá nhân" />
                  <View className="gap-4">
                    <View>
                      <Text className="text-sm font-semibold leading-5 text-[#6D7A6E]">
                        Họ và Tên
                      </Text>
                      <Text className="text-[18px] font-bold leading-7 text-foreground">
                        {profile.fullName}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm font-semibold leading-5 text-[#6D7A6E]">
                        Tuổi / Giới tính
                      </Text>
                      <Text className="text-[18px] font-bold leading-7 text-foreground">
                        {formatAgeGender(profile)}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    className="self-end flex-row items-center gap-1 pt-2"
                    onPress={() => router.push('/health-profile' as Href)}
                  >
                    <Text className="text-base font-bold leading-6 text-[#006492]">Chỉnh sửa</Text>
                    <Feather color="#006492" name="edit-2" size={13} />
                  </Pressable>
                </View>
              </CardShell>

              <CardShell className="border-[#BCCABC4D] bg-[#F3F3F6]" delayStyle={cardStyle(1)}>
                <View className="gap-4">
                  <SectionTitle color="#904D00" icon="activity" title="Chỉ số sức khỏe" />
                  <View className="flex-row gap-4">
                    <MetricTile label="Cân nặng" value={formatMeasurement(profile.weight, 'kg')} />
                    <MetricTile label="Chiều cao" value={formatMeasurement(profile.height, 'cm')} />
                  </View>
                  <View className="rounded-[8px] bg-[#D7ECFB] p-3">
                    <Text className="text-xs uppercase leading-[18px] text-[#004A6D]">
                      Target BMI
                    </Text>
                    <Text className="text-[18px] font-bold leading-7 text-[#004A6D]">
                      {bmiText}
                    </Text>
                  </View>
                </View>
              </CardShell>

              <CardShell className="border-l-4 border-l-primary-600" delayStyle={cardStyle(2)}>
                <View className="gap-4">
                  <SectionTitle color="#904D00" icon="coffee" title="Hồ sơ chế độ ăn uống" />
                  <View className="flex-row flex-wrap gap-3">
                    {chips.map((chip) => (
                      <SummaryChip chip={chip} key={chip.id} />
                    ))}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    className="self-end flex-row items-center gap-1"
                    onPress={() => router.push('/health-profile' as Href)}
                  >
                    <Text className="text-base leading-6 text-[#006492]">Chỉnh sửa</Text>
                    <Feather color="#006492" name="edit-2" size={13} />
                  </Pressable>
                </View>
              </CardShell>

              <Animated.View
                className="overflow-hidden rounded-[12px] bg-primary-600 p-8"
                style={[
                  {
                    backgroundColor: colors.primary,
                    boxShadow: '0 10px 24px rgba(39, 174, 96, 0.22)',
                  },
                  cardStyle(3),
                ]}
              >
                <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
                <View className="absolute right-4 top-8 h-16 w-16 items-center justify-center rounded-full bg-primary-700/40">
                  <Feather color="#64D18F" name="settings" size={34} />
                </View>
                <View className="max-w-[310px] gap-2">
                  <Text className="text-[24px] font-semibold leading-8 text-white">
                    Sẵn sàng phân tích
                  </Text>
                  <Text className="text-base leading-6 text-white/90">
                    Nutelyt của bạn đã được thiết lập để phân tích và sàng lọc hơn 200.000 sản
                    phẩm thực phẩm dựa trên hồ sơ sức khỏe riêng của bạn.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                className="rounded-[12px] border-2 border-primary-700 bg-[#E2E2E5] p-[18px]"
                style={cardStyle(4)}
              >
                <View className="flex-row items-start gap-4">
                  <Feather color={colors.primaryDark} name="shield" size={24} />
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold leading-5 text-foreground">
                      Thiết lập ban đầu
                    </Text>
                    <Text className="text-base leading-6 text-muted">
                      {
                        "Thông tin này được bảo mật trên thiết bị cá nhân của bạn. Các lần quét sau sẽ dựa trên dữ liệu này để cung cấp cảnh báo thực phẩm 'An toàn/Không an toàn' theo thời gian thực."
                      }
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </Animated.View>

        <View
          className="absolute bottom-0 left-0 right-0 gap-3 border-t border-[#E2E2E5] bg-card px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 10), boxShadow: '0 -4px 8px rgba(0,0,0,0.06)' }}
        >
          <AnimatedPressable
            accessibilityRole="button"
            className="h-14 flex-row items-center justify-center gap-3 rounded-[12px] bg-primary-600"
            onPress={() => {
              setSaved(true);
              router.replace({
                pathname: '/dashboard',
                params: { profile: profileParam },
              } as unknown as Href);
            }}
            onPressIn={() => {
              Animated.spring(saveScale, {
                damping: 12,
                stiffness: 260,
                toValue: 0.98,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.spring(saveScale, {
                damping: 12,
                stiffness: 260,
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
            style={[smallShadow, { transform: [{ scale: saveScale }] }]}
          >
            <Text className="text-base leading-6 text-white">
              {saved ? 'Đã lưu hồ sơ' : 'Lưu hồ sơ sức khỏe'}
            </Text>
            <Feather color="#FFFFFF" name={saved ? 'check-circle' : 'arrow-right-circle'} size={18} />
          </AnimatedPressable>

          <View className="flex-row gap-2">
            <BottomTabItem icon="home" label="Home" />
            <BottomTabItem icon="maximize" label="Quét" />
            <BottomTabItem icon="clock" label="Lịch sử" />
            <BottomTabItem active icon="user" label="Profile" />
          </View>
        </View>
      </View>
    </>
  );
}
