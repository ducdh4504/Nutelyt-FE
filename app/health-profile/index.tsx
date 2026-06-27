import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';

type IconName = ComponentProps<typeof Feather>['name'];
type Gender = 'Nam' | 'Nữ' | 'Khác';

type Option = {
  description?: string;
  icon: IconName;
  id: string;
  label: string;
  tone: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const shadow = { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' };
const primary = colors.primary;
const brand = colors.primaryDark;

const purposes: Option[] = [
  {
    id: 'chronic',
    label: 'Người bệnh mãn tính',
    description:
      'Khó chọn món ăn phù hợp với tình trạng sức khỏe và các thành phần cần kiểm soát.',
    icon: 'activity',
    tone: brand,
  },
  {
    id: 'personal',
    label: 'Người quan tâm sức khỏe cá nhân',
    description:
      'Khó xác định món ăn phù hợp với mục tiêu giảm cân, tăng cơ, ăn lành mạnh, cải thiện vóc dáng hoặc ăn theo chế độ.',
    icon: 'user',
    tone: '#006492',
  },
  {
    id: 'family',
    label: 'Người quan tâm sức khỏe gia đình',
    description:
      'Khó lựa chọn và điều chỉnh bữa ăn phù hợp cho nhiều thành viên có nhu cầu dinh dưỡng khác nhau, đồng thời phải cân đối chi phí sinh hoạt hằng ngày.',
    icon: 'users',
    tone: '#904D00',
  },
];

const conditions: Option[] = [
  { id: 'diabetes', label: 'Tiểu đường', icon: 'droplet', tone: brand },
  { id: 'pressure', label: 'Tăng huyết áp', icon: 'trending-up', tone: '#006492' },
  { id: 'heart', label: 'Bệnh tim mạch', icon: 'heart', tone: '#904D00' },
  { id: 'fat', label: 'Rối loạn mỡ máu', icon: 'bar-chart-2', tone: brand },
  { id: 'kidney', label: 'Bệnh thận', icon: 'shield', tone: '#006492' },
  { id: 'stomach', label: 'Bệnh dạ dày', icon: 'coffee', tone: '#904D00' },
];

const goals: Option[] = [
  {
    id: 'loss',
    label: 'Giảm cân',
    description:
      'Duy trì mức thâm hụt calo phù hợp để hỗ trợ giảm cân, đồng thời đảm bảo cân bằng dinh dưỡng.',
    icon: 'trending-down',
    tone: brand,
  },
  {
    id: 'maintain',
    label: 'Duy trì sức khỏe',
    description:
      'Hỗ trợ duy trì cân nặng hiện tại đồng thời cải thiện các chỉ số sức khỏe tổng quát.',
    icon: 'heart',
    tone: '#006492',
  },
  {
    id: 'muscle',
    label: 'Tăng cơ',
    description:
      'Ưu tiên lượng protein cao kết hợp với mức calo dư phù hợp nhằm hỗ trợ tăng khối lượng cơ và cải thiện sức mạnh.',
    icon: 'zap',
    tone: '#904D00',
  },
  {
    id: 'gain',
    label: 'Tăng cân',
    description:
      'Điều chỉnh lượng calo mục tiêu nhằm hỗ trợ tăng cân an toàn, đồng thời đảm bảo cân bằng dinh dưỡng.',
    icon: 'trending-up',
    tone: brand,
  },
];

const diets: Option[] = [
  {
    id: 'keto',
    label: 'Keto',
    description: 'ít tinh bột, nhiều chất béo',
    icon: 'target',
    tone: brand,
  },
  {
    id: 'low-carb',
    label: 'Giảm tinh bột',
    description: 'Giảm đường và tinh bột.',
    icon: 'pie-chart',
    tone: '#006492',
  },
  {
    id: 'vegan',
    label: 'Chay',
    description: 'Chế độ ăn thuần thực vật',
    icon: 'sun',
    tone: brand,
  },
  {
    id: 'bulking',
    label: 'Tăng cơ',
    description: 'Cung cấp calo dư để phát triển cơ bắp',
    icon: 'zap',
    tone: '#904D00',
  },
  {
    id: 'cutting',
    label: 'Giảm mỡ',
    description: 'Thâm hụt calo để giảm mỡ cơ thể',
    icon: 'scissors',
    tone: '#006492',
  },
];

export default function HealthProfileRoute() {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 320,
      toValue: (step + 1) / 5,
      useNativeDriver: false,
    }).start();
  }, [progress, step]);

  const animateTo = (nextStep: number) => {
    const direction = nextStep > step ? 1 : -1;
    Animated.parallel([
      Animated.timing(opacity, { duration: 120, toValue: 0, useNativeDriver: true }),
      Animated.timing(translateX, {
        duration: 120,
        toValue: -18 * direction,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      translateX.setValue(24 * direction);
      Animated.parallel([
        Animated.timing(opacity, { duration: 220, toValue: 1, useNativeDriver: true }),
        Animated.spring(translateX, {
          damping: 18,
          stiffness: 170,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goBack = () => {
    if (step === 0) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/login');
      }
      return;
    }
    animateTo(step - 1);
  };

  const canContinue =
    (step === 0 && purpose) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && goal) ||
    (step === 4 && diet);

  const continueFlow = () => {
    if (!canContinue) {
      return;
    }
    if (step === 4) {
      router.push('/health-profile/complete' as Href);
      return;
    }
    animateTo(step + 1);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center justify-between px-5">
          <Pressable
            accessibilityLabel="Quay lại"
            accessibilityRole="button"
            className="h-12 w-12 items-center justify-center rounded-full"
            onPress={goBack}
          >
            <Feather color={brand} name="chevron-left" size={24} />
          </Pressable>
          <Text className="absolute left-0 right-0 text-center text-xl font-bold text-primary-700">
            Nutelyt
          </Text>
          <View className="rounded-full bg-[#EEEFF0] px-3 py-1">
            <Text className="text-sm text-muted">{step + 1}/5</Text>
          </View>
        </View>

        <View className="px-5 pt-3">
          <View className="h-2 overflow-hidden rounded-full bg-[#E8EFE9]">
            <Animated.View
              className="h-full rounded-full bg-primary-600"
              style={{ width: progressWidth }}
            />
          </View>
        </View>

        <Animated.View
          className="flex-1"
          style={{ opacity, transform: [{ translateX }] }}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              gap: 24,
              paddingBottom: 24,
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 ? (
              <View className="gap-6">
                <Header
                  centered
                  subtitle="Mục đích của bạn khi sử dụng Nutelyt"
                  title="Mục đích sử dụng"
                />
                <OptionList options={purposes} selected={purpose} setSelected={setPurpose} />
                <Info>
                  Lựa chọn này chỉ ảnh hưởng đến cách AI đưa ra gợi ý và không giới hạn
                  các tính năng của ứng dụng. Bạn luôn có thể cập nhật khi nhu cầu thay
                  đổi.
                </Info>
              </View>
            ) : null}

            {step === 1 ? (
              <View className="gap-6">
                <Header
                  centered
                  subtitle="Để đưa ra phân tích dinh dưỡng phù hợp với bạn, AI cần biết một số thông tin cơ bản về tình trạng thể chất của bạn."
                  title="Hồ sơ sức khỏe"
                />
                <View className="gap-4 rounded-[12px] bg-card p-6" style={shadow}>
                  <Info compact>
                    Thông tin từ AI: Những dữ liệu này giúp chúng tôi tính toán chính xác
                    hơn nhu cầu calo hằng ngày và khả năng hấp thụ dưỡng chất của bạn.
                  </Info>
                  <Field
                    keyboardType="number-pad"
                    label="Tuổi"
                    onChangeText={setAge}
                    placeholder="e.g. 45"
                    suffix="Năm"
                    value={age}
                  />
                  <View className="gap-2">
                    <Text className="px-1 text-sm text-muted">Giới tính</Text>
                    <View className="h-14 flex-row rounded-[12px] bg-[#EEF2EE] p-1">
                      {(['Nam', 'Nữ', 'Khác'] as Gender[]).map((item) => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ selected: gender === item }}
                          className={`flex-1 items-center justify-center rounded-[10px] ${
                            gender === item ? 'bg-card' : ''
                          }`}
                          key={item}
                          onPress={() => setGender(item)}
                          style={gender === item ? shadow : undefined}
                        >
                          <Text
                            className={`text-sm ${
                              gender === item ? 'text-primary-700' : 'text-muted'
                            }`}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View className="flex-row gap-4">
                    <Field
                      className="flex-1"
                      keyboardType="number-pad"
                      label="Chiều cao"
                      onChangeText={setHeight}
                      placeholder="175"
                      suffix="cm"
                      value={height}
                    />
                    <Field
                      className="flex-1"
                      keyboardType="number-pad"
                      label="Cân nặng"
                      onChangeText={setWeight}
                      placeholder="72"
                      suffix="kg"
                      value={weight}
                    />
                  </View>
                  <View className="flex-row gap-2">
                    <Feather color="#6D7A6E" name="lock" size={14} />
                    <Text className="flex-1 text-xs leading-[18px] text-[#6D7A6E]">
                      Dữ liệu của bạn được mã hóa và chỉ được sử dụng cho mục đích phân
                      tích.
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  className="min-h-20 justify-center rounded-[12px] bg-card px-6"
                  style={shadow}
                >
                  <Text className="text-lg text-foreground">+ Thêm thành viên</Text>
                </Pressable>
              </View>
            ) : null}

            {step === 2 ? (
              <View className="gap-6">
                <Header
                  centered
                  subtitle="Vui lòng chọn các tình trạng bệnh lý liên quan. Thông tin này giúp chúng tôi điều chỉnh phân tích và tư vấn dinh dưỡng theo nhu cầu sức khỏe của bạn."
                  title="Tình trạng bệnh lý"
                />
                <View className="gap-4">
                  {conditions.map((item, index) => (
                    <OptionCard
                      compact
                      index={index}
                      isSelected={selectedConditions.includes(item.id)}
                      key={item.id}
                      onPress={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut
                        );
                        setSelectedConditions((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id]
                        );
                      }}
                      option={item}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {step === 3 ? (
              <View className="gap-6">
                <Header
                  subtitle="Điều này giúp chúng tôi cá nhân hóa các khuyến nghị dinh dưỡng hằng ngày và mục tiêu calo phù hợp với bạn."
                  title="Mục tiêu sức khỏe của bạn là gì?"
                />
                <OptionList options={goals} selected={goal} setSelected={setGoal} />
                <Info>
                  Mục tiêu này giúp Nutelyt ưu tiên cách phân tích calo, protein và khẩu
                  phần phù hợp với nhu cầu hiện tại của bạn.
                </Info>
              </View>
            ) : null}

            {step === 4 ? (
              <View className="gap-6">
                <Header
                  subtitle="Vui lòng chọn chế độ ăn phù hợp nhất với lối sống của bạn. Thông tin này giúp chúng tôi cá nhân hóa kết quả phân tích và khuyến nghị dinh dưỡng."
                  title="Chế độ ăn của bạn là gì?"
                />
                <View className="flex-row flex-wrap justify-between gap-y-4">
                  {diets.map((item, index) => (
                    <OptionCard
                      bento={index < 4}
                      index={index}
                      isSelected={diet === item.id}
                      key={item.id}
                      onPress={() => setDiet(item.id)}
                      option={item}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>

        <View
          className="border-t border-[#E2E2E5] bg-card px-5 py-5"
          style={{
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
            paddingBottom: Math.max(insets.bottom + 12, 20),
          }}
        >
          <PrimaryButton disabled={!canContinue} onPress={continueFlow} />
          {step === 2 ? (
            <SecondaryButton
              onPress={() => {
                setSelectedConditions([]);
                animateTo(3);
              }}
            >
              Tôi không có bệnh lý nào.
            </SecondaryButton>
          ) : null}
          {step === 4 ? (
            <SecondaryButton
              onPress={() => {
                setDiet('');
                router.push('/health-profile/complete' as Href);
              }}
            >
              Tôi không theo chế độ nào.
            </SecondaryButton>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Header({
  centered = false,
  subtitle,
  title,
}: {
  centered?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <View className="gap-2">
      <Text
        className={`text-[28px] leading-9 text-foreground ${centered ? 'text-center' : ''}`}
      >
        {title}
      </Text>
      <Text className={`text-base leading-6 text-muted ${centered ? 'text-center' : ''}`}>
        {subtitle}
      </Text>
    </View>
  );
}

function OptionList({
  options,
  selected,
  setSelected,
}: {
  options: Option[];
  selected: string;
  setSelected: (id: string) => void;
}) {
  return (
    <View className="gap-4">
      {options.map((item, index) => (
        <OptionCard
          index={index}
          isSelected={selected === item.id}
          key={item.id}
          onPress={() => setSelected(item.id)}
          option={item}
        />
      ))}
    </View>
  );
}

function OptionCard({
  bento = false,
  compact = false,
  index,
  isSelected,
  onPress,
  option,
}: {
  bento?: boolean;
  compact?: boolean;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  option: Option;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const selectedScale = useRef(new Animated.Value(isSelected ? 1.01 : 1)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      delay: index * 55,
      duration: 260,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [entrance, index]);

  useEffect(() => {
    Animated.spring(selectedScale, {
      damping: 15,
      stiffness: 180,
      toValue: isSelected ? 1.01 : 1,
      useNativeDriver: true,
    }).start();
  }, [isSelected, selectedScale]);

  const translateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={`rounded-[12px] border-2 bg-card ${
        bento ? 'p-[22px]' : compact ? 'px-[18px] py-[18px]' : 'p-[22px]'
      }`}
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(pressScale, {
          damping: 12,
          stiffness: 260,
          toValue: 0.97,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(pressScale, {
          damping: 12,
          stiffness: 260,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      style={[
        shadow,
        bento ? { minHeight: 175, width: '47.5%' } : undefined,
        compact ? { alignSelf: 'flex-start', maxWidth: '100%', minWidth: 198 } : undefined,
        {
          borderColor: isSelected ? primary : 'transparent',
          opacity: entrance,
          transform: [
            { translateY },
            { scale: Animated.multiply(pressScale, selectedScale) },
          ],
        },
      ]}
    >
      {bento ? (
        <View className="flex-1 justify-between">
          <Icon option={option} />
          <View className="gap-1">
            <Text className="text-xl leading-7 text-foreground">{option.label}</Text>
            <Text className="text-sm leading-[18px] text-muted">{option.description}</Text>
          </View>
        </View>
      ) : (
        <View className={`flex-row ${compact ? 'items-center gap-4' : 'gap-4'}`}>
          <Icon option={option} />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-xl leading-7 text-foreground">{option.label}</Text>
            {option.description ? (
              <Text className="text-base leading-6 text-muted">{option.description}</Text>
            ) : null}
          </View>
          {isSelected ? (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-600">
              <Feather color="#FFFFFF" name="check" size={15} />
            </View>
          ) : (
            <View className="h-6 w-6 rounded-full border border-[#C9D4CA]" />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}

function Icon({ option }: { option: Option }) {
  return (
    <View
      className="h-12 w-12 items-center justify-center rounded-full"
      style={{ backgroundColor: `${option.tone}18` }}
    >
      <Feather color={option.tone} name={option.icon} size={21} />
    </View>
  );
}

function Info({ children, compact = false }: { children: string; compact?: boolean }) {
  return (
    <View
      className={`flex-row gap-3 rounded-[12px] border border-[#DCE6DD] bg-[#F3F3F6] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <Feather color="#006492" name="info" size={20} />
      <Text
        className={`${compact ? 'text-sm leading-[22px]' : 'text-base leading-6'} flex-1 text-muted`}
      >
        {children}
      </Text>
    </View>
  );
}

function Field({
  className = '',
  label,
  suffix,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  className?: string;
  label: string;
  suffix: string;
}) {
  return (
    <View className={`gap-2 ${className}`}>
      <Text className="px-1 text-sm text-muted">{label}</Text>
      <View className="h-14 flex-row items-center rounded-[12px] border border-[#DDE7DD] bg-card px-4">
        <TextInput
          className="h-full flex-1 text-lg text-foreground"
          placeholderTextColor="#6B7280"
          {...props}
        />
        <Text className="text-base text-muted">{suffix}</Text>
      </View>
    </View>
  );
}

function PrimaryButton({ disabled, onPress }: { disabled: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      className="h-14 flex-row items-center justify-center gap-2 rounded-[12px] bg-primary-600"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          damping: 12,
          stiffness: 260,
          toValue: 0.98,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          damping: 12,
          stiffness: 260,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      style={[shadow, { opacity: disabled ? 0.45 : 1, transform: [{ scale }] }]}
    >
      <Text className="text-base text-white">Tiếp tục</Text>
      <Feather color="#FFFFFF" name="arrow-right" size={17} />
    </AnimatedPressable>
  );
}

function SecondaryButton({
  children,
  onPress,
}: {
  children: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="mt-4 h-12 items-center justify-center rounded-[12px]"
      onPress={onPress}
    >
      <Text className="text-base text-primary-700">{children}</Text>
    </Pressable>
  );
}
