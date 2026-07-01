import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/tokens';
import type { RouteProfileParams } from '@/src/features/main/types';
import { parseHealthProfileParam, serializeProfile } from '@/src/features/main/utils/health-profile';

type FeatherName = ComponentProps<typeof Feather>['name'];
type ChatMode = 'entry' | 'chat' | 'detail';
type RecipeTab = 'overview' | 'ingredients' | 'steps' | 'nutrition';
type MainTab = 'home' | 'history' | 'chatAi' | 'profile';
type ChatMessage =
  | { id: string; role: 'user' | 'assistant'; text: string }
  | { id: string; role: 'assistant'; type: 'bun-bo-card' };

const recipe = {
  name: 'Bún bò',
  chips: ['Giảm muối', 'Ít béo', 'Tăng rau xanh'],
  nutrition: {
    calories: '520 kcal',
    protein: '28g',
    carb: '65g',
    fat: '15g',
  },
  overview: {
    goodPoints: ['Giàu protein từ nạc', 'Bổ sung chất sắt, kẽm', 'Có rau thơm, hỗ trợ tiêu hóa'],
    notes: ['Nước dùng nhiều muối', 'Bún chứa nhiều tinh bột'],
  },
  ingredients: [
    { title: 'Thịt', items: ['Bắp bò ............ 500g', 'Giò heo ............ 300g'] },
    {
      title: 'Nước dùng',
      items: ['Xương bò ............ 1.5kg', 'Sả ............ 3 cây', 'Hành tây ............ 1 củ', 'Gừng ............ 1 củ'],
    },
    {
      title: 'Gia vị',
      items: [
        'Mắm ruốc ............ 2 muỗng',
        'Muối ............ 1 thìa',
        'Đường ............ 2 muỗng',
        'Hạt nêm ............ 1 thìa',
        'Sa tế ............ Tùy chọn',
      ],
    },
    { title: 'Ăn kèm', items: ['Bún tươi ............ 500g', 'Rau sống', 'Giá đỗ', 'Hành lá, ngò rí', 'Chanh, ớt'] },
  ],
  steps: [
    'Sơ chế: Chần bắp bò và giò heo, rửa sạch. Đập dập sả, nướng gừng và hành.',
    'Nấu nước dùng: Hầm xương hoặc bắp bò, giò heo cùng sả, gừng, hành khoảng 1,5–2 giờ.',
    'Nêm gia vị: Hòa mắm ruốc, lọc lấy nước, cho vào nồi. Nêm muối, đường phèn, hạt nêm vừa ăn.',
    'Chuẩn bị tô: Trụng bún, xếp thịt bò, giò heo vào tô.',
    'Hoàn thành: Chan nước dùng nóng, thêm hành, ngò, ăn kèm rau sống, chanh và sa tế.',
  ],
};

const tabs: { id: MainTab; icon: FeatherName; label: string; path: string }[] = [
  { id: 'home', icon: 'home', label: 'Nhà', path: '/dashboard' },
  { id: 'history', icon: 'clock', label: 'Lịch sử', path: '/scan-history' },
  { id: 'chatAi', icon: 'message-circle', label: 'Chat AI', path: '/chat-ai' },
  { id: 'profile', icon: 'user', label: 'Hồ sơ', path: '/profile' },
];

const optionCards: { icon: FeatherName; title: string; subtitle: string; tone: string; iconColor: string; enabled: boolean }[] = [
  {
    icon: 'book-open',
    title: 'Nấu tại nhà (tự chọn món)',
    subtitle: 'Tôi muốn tự chọn món mình sẽ nấu',
    tone: '#FFF3E2',
    iconColor: '#F97316',
    enabled: true,
  },
  {
    icon: 'shopping-bag',
    title: 'Nấu tại nhà (gợi ý món)',
    subtitle: 'Tôi muốn gợi ý món phù hợp',
    tone: '#EAF7EF',
    iconColor: '#16A34A',
    enabled: false,
  },
  {
    icon: 'shopping-cart',
    title: 'Ăn ngoài',
    subtitle: 'Tôi muốn kiểm tra món ăn',
    tone: '#FFF0EC',
    iconColor: '#EF4444',
    enabled: false,
  },
];

const detailTabs: { id: RecipeTab; label: string }[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'ingredients', label: 'Nguyên liệu' },
  { id: 'steps', label: 'Cách làm' },
  { id: 'nutrition', label: 'Dinh dưỡng' },
];

const nutritionTableRows = [
  ['Năng lượng', '520 kcal', '26%'],
  ['Carbohydrate', '65 g', '22%'],
  ['Protein', '28 g', '56%'],
  ['Chất béo', '16 g', '30%'],
  ['Chất xơ', '6 g', '12%'],
  ['Đường', '6 g', '4%'],
  ['Natri', '1250 mg', '54%'],
];

const cardShadow = { boxShadow: '0 14px 28px rgba(0, 0, 0, 0.06)' };
const softShadow = { boxShadow: '0 8px 18px rgba(39, 174, 96, 0.18)' };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function BottomTabBar({ active, profileParam }: { active: MainTab; profileParam?: string }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center gap-2 bg-card px-6 pt-3"
      style={{
        boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.06)',
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-w-[68px] flex-1 items-center justify-center gap-1 rounded-[12px] py-2 ${
              isActive ? 'bg-primary-50' : ''
            }`}
            key={tab.id}
            onPress={() =>
              router.push({
                pathname: tab.path,
                params: profileParam ? { profile: profileParam } : undefined,
              } as unknown as Href)
            }
          >
            <Feather color={isActive ? '#006D37' : '#3D4A3F'} name={tab.icon} size={19} />
            <Text className={`text-center text-xs font-semibold leading-4 ${isActive ? 'text-primary-700' : 'text-muted'}`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ChatHeader({ onBack, topInset }: { onBack: () => void; topInset: number }) {
  return (
    <View
      className="flex-row items-center bg-card px-5"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        height: Math.max(topInset + 48, 72),
        paddingTop: topInset,
      }}
    >
      <Pressable accessibilityLabel="Quay lại" accessibilityRole="button" className="h-12 w-12 justify-center" onPress={onBack}>
        <Feather color={colors.primaryDark} name="chevron-left" size={24} />
      </Pressable>
      <View className="flex-1 items-center pr-12">
        <Text className="text-base font-bold leading-5 text-[#565B68]">Trợ lý dinh dưỡng AI</Text>
        <Text className="text-[10px] font-bold leading-4 text-[#86BA9B]">Sẵn sàng hỗ trợ bạn!</Text>
      </View>
    </View>
  );
}

function AIEntryImage() {
  return (
    <View
      className="h-[124px] w-[124px] items-center justify-center overflow-hidden rounded-full border-2 border-primary-600 bg-primary-50"
      style={{ boxShadow: '0 14px 28px rgba(0, 109, 55, 0.16)' }}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={require('../../assets/images/Nutelyt-AI.png')}
        style={{ height: 116, width: 116 }}
      />
    </View>
  );
}

function Chip({ label, solid = false }: { label: string; solid?: boolean }) {
  return (
    <View className={`rounded-full px-3 py-1 ${solid ? 'bg-primary-600' : 'bg-primary-100'}`}>
      <Text className={`text-xs font-bold leading-4 ${solid ? 'text-white' : 'text-primary-700'}`}>{label}</Text>
    </View>
  );
}

function FoodPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <View className={`${compact ? 'h-[148px]' : 'h-[286px]'} overflow-hidden bg-[#B97945]`}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={require('../../assets/images/Food/Bun-bo.png')}
        style={{ height: '100%', width: '100%' }}
      />
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-black/15" />
      <Text className="absolute bottom-4 right-5 text-sm font-bold text-white">Bún bò</Text>
    </View>
  );
}

function NutritionSummary({ compact = false, fatValue = recipe.nutrition.fat }: { compact?: boolean; fatValue?: string }) {
  const items = [
    ['CALORIE', recipe.nutrition.calories],
    ['PROTEIN', recipe.nutrition.protein],
    ['CARB', recipe.nutrition.carb],
    ['FAT', fatValue],
  ];

  return (
    <View className={`flex-row rounded-[8px] bg-[#F9FAFB] ${compact ? 'py-3' : 'py-5'}`}>
      {items.map(([label, value], index) => (
        <View className={`flex-1 items-center gap-1 ${index ? 'border-l border-[#E6E8EC]' : ''}`} key={label}>
          <Text className="text-[10px] leading-4 text-[#A3A8B1]">{label}</Text>
          <Text className="text-[15px] font-bold leading-5 text-[#59616B]">{value}</Text>
        </View>
      ))}
    </View>
  );
}

function EntryScreen({ onSelect }: { onSelect: () => void }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ gap: 28, paddingBottom: 128, paddingHorizontal: 12, paddingTop: 22 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center gap-5">
        <AIEntryImage />
        <Text className="text-center text-[13px] font-bold leading-5 text-[#6A7080]">Bạn muốn mình hỗ trợ về điều gì?</Text>
      </View>

      <View className="gap-3">
        {optionCards.map((option) => (
          <Pressable
            accessibilityRole="button"
            className="min-h-[76px] flex-row items-center rounded-[4px] border border-[#F3F4F5] bg-card px-4 py-4"
            disabled={!option.enabled}
            key={option.title}
            onPress={option.enabled ? onSelect : undefined}
            style={cardShadow}
          >
            <View className="h-[42px] w-[42px] items-center justify-center rounded-[12px]" style={{ backgroundColor: option.tone }}>
              <Feather color={option.iconColor} name={option.icon} size={22} />
            </View>
            <View className="min-w-0 flex-1 px-4">
              <Text className="text-[14px] font-bold leading-5 text-[#585D6E]">{option.title}</Text>
              <Text className="text-[12px] leading-[18px] text-[#9FA0B0]">{option.subtitle}</Text>
            </View>
            <Feather color="#C6CAD3" name="chevron-right" size={20} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function ChatBubble({ align, children }: { align: 'user' | 'assistant'; children: ReactNode }) {
  const user = align === 'user';
  return (
    <View className={`max-w-[86%] rounded-[7px] px-4 py-3 ${user ? 'self-end bg-primary-600' : 'self-start bg-primary-600'}`}>
      <Text className="text-[13px] leading-5 text-white">{children}</Text>
    </View>
  );
}

function RecipeSuggestionCard({ onOpen }: { onOpen: () => void }) {
  return (
    <View className="overflow-hidden rounded-[8px] bg-[#DADADA]" style={cardShadow}>
      <FoodPlaceholder compact />
      <View className="gap-2 rounded-t-[16px] bg-card p-4">
        <Text className="text-base font-bold leading-6 text-foreground">{recipe.name}</Text>
        <View className="flex-row flex-wrap gap-2">
          {recipe.chips.map((chip) => (
            <Chip key={chip} label={chip} solid />
          ))}
        </View>
        <View className="mt-2 flex-row border-t border-[#E9ECEF] pt-3">
          {[
            ['Calorie', recipe.nutrition.calories],
            ['Protein', recipe.nutrition.protein],
            ['Carb', recipe.nutrition.carb],
          ].map(([label, value]) => (
            <View className="flex-1" key={label}>
              <Text className="text-[11px] leading-4 text-[#3F4854]">{label}</Text>
              <Text className="text-[11px] font-semibold leading-4 text-[#818182]">{value}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="items-center pb-3">
        <Pressable
          accessibilityRole="button"
          className="h-9 min-w-[190px] items-center justify-center rounded-[7px] bg-primary-600 px-4"
          onPress={onOpen}
        >
          <Text className="text-xs leading-4 text-white">Xem chi tiết công thức</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ChatScreen({ keyboardHeight, onOpenDetail }: { keyboardHeight: number; onOpenDetail: () => void }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isKeyboardOpen = keyboardHeight > 0;

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const normalized = normalizeForSearch(trimmed);
    const isBunBo = normalized.includes('bun bo');
    const timestamp = Date.now().toString();
    const nextMessages: ChatMessage[] = [
      { id: `user-${timestamp}`, role: 'user', text: trimmed },
      isBunBo
        ? {
            id: `assistant-${timestamp}`,
            role: 'assistant',
            text: 'Đây là gợi ý công thức bún bò phù hợp với tình trạng sức khỏe của bạn:',
          }
        : {
            id: `assistant-${timestamp}`,
            role: 'assistant',
            text: `Nutelyt vẫn đang phát triển, hiện chưa có thông tin về "${trimmed}". Bạn có thể thử nhập "bún bò" để xem gợi ý mẫu trong bản MVP.`,
          },
    ];

    if (isBunBo) {
      nextMessages.push({ id: `bun-bo-card-${timestamp}`, role: 'assistant', type: 'bun-bo-card' });
    }

    setMessages((currentMessages) => [...currentMessages, ...nextMessages]);
    setInput('');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{
          gap: 18,
          paddingBottom: isKeyboardOpen ? keyboardHeight + 112 : Math.max(insets.bottom + 188, 216),
          paddingHorizontal: 20,
          paddingTop: 40,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-5 pb-2">
          <AIEntryImage />
          <View className="items-center gap-2">
            <Text className="text-center text-[24px] font-bold leading-8 text-[#404140]">Bạn muốn nấu món gì?</Text>
            <Text className="max-w-[270px] text-center text-[13px] leading-5 text-[#999B98]">
              Chia sẻ tên món ăn, mình sẽ phân tích dinh dưỡng giúp bạn.
            </Text>
          </View>
        </View>

        {messages.map((message) =>
          'type' in message ? (
            <RecipeSuggestionCard key={message.id} onOpen={onOpenDetail} />
          ) : (
            <ChatBubble align={message.role === 'user' ? 'user' : 'assistant'} key={message.id}>
              {message.text}
            </ChatBubble>
          )
        )}
      </ScrollView>

      <View
        className="absolute left-0 right-0 border-t border-[#E7ECE8] bg-background px-5 pt-3"
        style={{
          bottom: isKeyboardOpen ? keyboardHeight : Math.max(insets.bottom + 82, 96),
          paddingBottom: 12,
        }}
      >
        <View className="flex-row items-center gap-3 rounded-[18px] bg-[#F6F7F8] px-5 py-4">
          <TextInput
            className="min-h-10 flex-1 text-[13px] text-foreground"
            cursorColor={colors.primaryDark}
            onChangeText={setInput}
            onSubmitEditing={send}
            placeholder="Nhập tin nhắn của bạn..."
            placeholderTextColor="#979AAB"
            returnKeyType="send"
            value={input}
          />
          <Pressable
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full bg-primary-700"
            onPress={send}
          >
            <Feather color="#FFFFFF" name="send" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function OverviewTab() {
  return (
    <View className="gap-6">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">Đánh giá đối với sức khỏe</Text>
      <View className="gap-4">
        <Text className="text-base font-medium leading-6 text-[#4EB975]">Điểm tốt</Text>
        {recipe.overview.goodPoints.map((point) => (
          <View className="flex-row items-center gap-3" key={point}>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-100">
              <Feather color="#22C55E" name="check" size={14} />
            </View>
            <Text className="flex-1 text-base leading-6 text-[#90969E]">{point}</Text>
          </View>
        ))}
      </View>
      <View className="gap-4">
        <Text className="text-base font-bold leading-6 text-[#F37575]">Điểm cần lưu ý</Text>
        {recipe.overview.notes.map((note) => (
          <View className="flex-row items-center gap-3" key={note}>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-[#FFEDEE]">
              <View className="h-2 w-2 rounded-full bg-[#F87171]" />
            </View>
            <Text className="flex-1 text-base leading-6 text-[#90969E]">{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function IngredientsTab() {
  return (
    <View className="gap-5">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">Nguyên liệu chế biến</Text>
      <View className="flex-row flex-wrap gap-y-6">
        {recipe.ingredients.map((group) => (
          <View className="w-1/2 pr-3" key={group.title}>
            <Text className="text-base font-bold leading-6 text-black">{group.title}</Text>
            {group.items.map((item) => (
              <Text className="text-[15px] leading-6 text-[#464343]" key={item}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function StepsTab() {
  return (
    <View className="gap-5">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">Các bước thực hiện</Text>
      <View className="gap-2">
        {recipe.steps.map((step, index) => {
          const [title, ...body] = step.split(': ');
          return (
            <Text className="text-base leading-[23px] text-[#464343]" key={step}>
              <Text className="font-bold text-black">{index + 1}. </Text>
              <Text className="font-bold text-black">{title}: </Text>
              {body.join(': ')}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

function NutritionTab() {
  return (
    <View className="gap-4">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">Bảng dinh dưỡng</Text>
      <View className="rounded-[12px] bg-white">
        <View className="flex-row pb-4">
          <Text className="text-base font-bold leading-6 text-[#3F4854]" style={{ flex: 1.35 }}>
            Thành phần
          </Text>
          <Text className="text-base font-bold leading-6 text-[#3F4854]" style={{ flex: 1 }}>
            Hàm lượng
          </Text>
          <Text className="text-base font-bold leading-6 text-[#3F4854]" style={{ flex: 0.75 }}>
            Giá trị
          </Text>
        </View>
        <View className="gap-4">
          {nutritionTableRows.map(([component, amount, value]) => (
            <View className="flex-row" key={component}>
              <Text className="text-base leading-6 text-black" style={{ flex: 1.35 }}>
                {component}
              </Text>
              <Text className="text-base leading-6 text-black" style={{ flex: 1 }}>
                {amount}
              </Text>
              <Text className="text-base leading-6 text-black" style={{ flex: 0.75 }}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function RecipeDetailScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecipeTab>('overview');
  const [saved, setSaved] = useState(false);
  const saveScale = useRef(new Animated.Value(1)).current;

  const tabContent = {
    overview: <OverviewTab />,
    ingredients: <IngredientsTab />,
    steps: <StepsTab />,
    nutrition: <NutritionTab />,
  }[activeTab];

  return (
    <View className="flex-1 bg-primary-600">
      <FoodPlaceholder />
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="absolute left-5 h-11 w-11 items-center justify-center rounded-full bg-white/75"
        onPress={onBack}
        style={{ top: Math.max(insets.top + 8, 22) }}
      >
        <Feather color={colors.primaryDark} name="chevron-left" size={24} />
      </Pressable>

      <View className="-mt-8 flex-1 overflow-hidden rounded-t-[28px] bg-card">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: 22,
            paddingBottom: Math.max(insets.bottom + 118, 144),
            paddingHorizontal: 20,
            paddingTop: 26,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-3">
            <Text className="text-[27px] font-bold leading-9 text-[#3C4551]">{recipe.name}</Text>
            <View className="flex-row flex-wrap gap-2">
              {recipe.chips.map((chip) => (
                <Chip key={chip} label={chip} />
              ))}
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pr-5">
              {detailTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Pressable
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                    className="h-[54px] min-w-[76px] items-center justify-start"
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                  >
                    <Text className={`text-base font-semibold leading-6 ${isActive ? 'text-[#5D9372]' : 'text-[#B8BDC6]'}`}>
                      {tab.label}
                    </Text>
                    <View className={`mt-[24px] h-[2px] w-full ${isActive ? 'bg-primary-600' : 'bg-transparent'}`} />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <NutritionSummary fatValue={activeTab === 'nutrition' ? '16g' : undefined} />
          {tabContent}
        </ScrollView>
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-white bg-card px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 14) }}
      >
        <AnimatedPressable
          accessibilityRole="button"
          className="h-[62px] items-center justify-center rounded-[16px] bg-primary-600"
          onPress={() => setSaved(true)}
          onPressIn={() => Animated.spring(saveScale, { damping: 12, stiffness: 260, toValue: 0.98, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(saveScale, { damping: 12, stiffness: 260, toValue: 1, useNativeDriver: true }).start()}
          style={[softShadow, { transform: [{ scale: saveScale }] }]}
        >
          <Text className="text-[17px] font-extrabold leading-6 text-white">
            {saved ? 'Đã lưu công thức' : 'Lưu công thức'}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default function ChatAIRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<RouteProfileParams>();
  const profile = useMemo(() => parseHealthProfileParam(params), [params]);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const [mode, setMode] = useState<ChatMode>('entry');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity, { duration: 220, toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { damping: 18, stiffness: 150, toValue: 0, useNativeDriver: true }),
    ]).start();
  }, [mode, opacity, translateY]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      Keyboard.scheduleLayoutAnimation(event);
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const goBack = () => {
    if (mode === 'detail') {
      setMode('chat');
      return;
    }
    if (mode === 'chat') {
      setMode('entry');
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({ pathname: '/dashboard', params: { profile: profileParam } } as unknown as Href);
  };

  if (mode === 'detail') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <RecipeDetailScreen onBack={goBack} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        <ChatHeader onBack={goBack} topInset={insets.top} />
        <Animated.View className="flex-1" style={{ opacity, transform: [{ translateY }] }}>
          {mode === 'entry' ? (
            <EntryScreen onSelect={() => setMode('chat')} />
          ) : (
            <ChatScreen keyboardHeight={keyboardHeight} onOpenDetail={() => setMode('detail')} />
          )}
        </Animated.View>
        {keyboardHeight > 0 ? null : <BottomTabBar active="chatAi" profileParam={profileParam} />}
      </View>
    </>
  );
}
