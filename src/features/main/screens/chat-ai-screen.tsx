import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ComponentProps, Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/src/constants/tokens";
import {
  alternateMealSuggestionRecipeIds,
  firstMealSuggestionRecipeIds,
  getMockRecipe,
  mockRecipes,
  type MockRecipe,
  type RecipeId,
} from "@/src/features/main/data/mock-recipes";

import { MainScreenHeader } from "../components/main-screen-header";

type FeatherName = ComponentProps<typeof Feather>["name"];
type ChatMode = "entry" | "chat" | "detail";
type ChatIntent = "self-select" | "meal-suggestion";
type ChatOptionId = ChatIntent | "eat-out";
type RecipeTab = "overview" | "ingredients" | "steps" | "nutrition";
type ChatMessage =
  | { id: string; role: "user" | "assistant"; text: string }
  | { id: string; role: "assistant"; type: "recipe-card"; recipeId: RecipeId };

const BUN_BO_RECIPE_ID: RecipeId = "bun-bo";
const mealSuggestionIntro =
  "Đây là gợi ý bữa cơm 3 món Việt Nam đơn giản dành cho bạn:";
const alternateMealSuggestionIntro =
  "Đây là một gợi ý bữa cơm 3 món khác để bạn thay đổi khẩu vị:";

const optionCards: {
  id: ChatOptionId;
  icon: FeatherName;
  title: string;
  subtitle: string;
  tone: string;
  iconColor: string;
  enabled: boolean;
}[] = [
  {
    id: "self-select",
    icon: "book-open",
    title: "Nấu tại nhà (tự chọn món)",
    subtitle: "Tôi muốn tự chọn món mình sẽ nấu",
    tone: "#FFF3E2",
    iconColor: "#F97316",
    enabled: true,
  },
  {
    id: "meal-suggestion",
    icon: "shopping-bag",
    title: "Nấu tại nhà (gợi ý món)",
    subtitle: "Tôi muốn gợi ý món phù hợp",
    tone: "#EAF7EF",
    iconColor: "#16A34A",
    enabled: true,
  },
  {
    id: "eat-out",
    icon: "shopping-cart",
    title: "Ăn ngoài",
    subtitle: "Tôi muốn kiểm tra món ăn",
    tone: "#FFF0EC",
    iconColor: "#EF4444",
    enabled: false,
  },
];

const detailTabs: { id: RecipeTab; label: string }[] = [
  { id: "overview", label: "Tổng quan" },
  { id: "ingredients", label: "Nguyên liệu" },
  { id: "steps", label: "Cách làm" },
  { id: "nutrition", label: "Dinh dưỡng" },
];

const cardShadow = { boxShadow: "0 14px 28px rgba(0, 0, 0, 0.06)" };
const softShadow = { boxShadow: "0 8px 18px rgba(39, 174, 96, 0.18)" };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function isFirstMealSuggestionRequest(normalized: string) {
  const hasVietnameseMealIntent =
    normalized.includes("viet nam") ||
    normalized.includes("mon viet") ||
    normalized.includes("bua com viet");
  const hasMealWords =
    normalized.includes("bua an") ||
    normalized.includes("bua com") ||
    normalized.includes("nau bua") ||
    normalized.includes("goi y mon");
  const hasThreeDishIntent =
    normalized.includes("3 mon") ||
    normalized.includes("ba mon") ||
    normalized.includes("co ban");

  return hasVietnameseMealIntent || (hasMealWords && hasThreeDishIntent);
}

function isAlternateMealSuggestionRequest(normalized: string) {
  const asksForDifferent =
    normalized.includes("khac") || normalized.includes("doi");
  const mentionsMenu =
    normalized.includes("mon") ||
    normalized.includes("thuc don") ||
    normalized.includes("bua com") ||
    normalized.includes("bua an");
  const mentionsThreeItems =
    normalized.includes("3 mon") || normalized.includes("ba mon");

  return (
    normalized.includes("doi mon khac") ||
    normalized.includes("thuc don khac") ||
    normalized.includes("bua com khac") ||
    normalized.includes("mon khac") ||
    (asksForDifferent && mentionsMenu) ||
    (mentionsThreeItems && asksForDifferent)
  );
}

function isChatIntent(optionId: ChatOptionId): optionId is ChatIntent {
  return optionId !== "eat-out";
}

function ChatHeader({
  onBack,
  showBack,
  topInset,
}: {
  onBack: () => void;
  showBack: boolean;
  topInset: number;
}) {
  return (
    <View
      className="flex-row items-center bg-card px-5"
      style={{
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        height: Math.max(topInset + 48, 72),
        paddingTop: topInset,
      }}
    >
      {showBack ? (
        <Pressable
          accessibilityLabel="Quay lại"
          accessibilityRole="button"
          className="h-12 w-12 justify-center"
          onPress={onBack}
        >
          <Feather color={colors.primaryDark} name="chevron-left" size={24} />
        </Pressable>
      ) : (
        <View className="h-12 w-12" />
      )}
      <View className="flex-1 items-center pr-12">
        <Text className="text-base font-bold leading-5 text-[#565B68]">
          Trợ lý dinh dưỡng AI
        </Text>
        <Text className="text-[10px] font-bold leading-4 text-[#86BA9B]">
          Sẵn sàng hỗ trợ bạn!
        </Text>
      </View>
    </View>
  );
}

function AIEntryImage() {
  return (
    <View
      className="h-[124px] w-[124px] items-center justify-center overflow-hidden rounded-full border-2 border-primary-600 bg-primary-50"
      style={{ boxShadow: "0 14px 28px rgba(0, 109, 55, 0.16)" }}
    >
      <Image
        accessibilityIgnoresInvertColors
        contentFit="contain"
        source={require("../../../../assets/images/Nutelyt-AI.png")}
        style={{ height: 116, width: 116 }}
      />
    </View>
  );
}

function Chip({ label, solid = false }: { label: string; solid?: boolean }) {
  return (
    <View
      className={`rounded-full px-3 py-1 ${solid ? "bg-primary-600" : "bg-primary-100"}`}
    >
      <Text
        className={`text-xs font-bold leading-4 ${solid ? "text-white" : "text-primary-700"}`}
      >
        {label}
      </Text>
    </View>
  );
}

function FoodPlaceholder({
  compact = false,
  recipe,
}: {
  compact?: boolean;
  recipe: MockRecipe;
}) {
  return (
    <View
      className={`${compact ? "h-[148px]" : "h-[286px]"} overflow-hidden bg-[#B97945]`}
    >
      <Image
        accessibilityIgnoresInvertColors
        contentFit="cover"
        source={recipe.image}
        style={{ height: "100%", width: "100%" }}
      />
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-black/15" />
      <Text className="absolute bottom-4 right-5 text-sm font-bold text-white">
        {recipe.name}
      </Text>
    </View>
  );
}

function NutritionSummary({
  compact = false,
  fatValue,
  recipe,
}: {
  compact?: boolean;
  fatValue?: string;
  recipe: MockRecipe;
}) {
  const items = [
    ["CALORIE", recipe.summaryNutrition.calories],
    ["PROTEIN", recipe.summaryNutrition.protein],
    ["CARB", recipe.summaryNutrition.carb],
    ["FAT", fatValue ?? recipe.summaryNutrition.fat],
  ];

  return (
    <View
      className={`flex-row rounded-[8px] bg-[#F9FAFB] ${compact ? "py-3" : "py-5"}`}
    >
      {items.map(([label, value], index) => (
        <View
          className={`flex-1 items-center gap-1 ${index ? "border-l border-[#E6E8EC]" : ""}`}
          key={label}
        >
          <Text className="text-[10px] leading-4 text-[#A3A8B1]">{label}</Text>
          <Text className="text-[15px] font-bold leading-5 text-[#59616B]">
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function EntryScreen({ onSelect }: { onSelect: (intent: ChatIntent) => void }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        gap: 28,
        paddingBottom: 128,
        paddingHorizontal: 12,
        paddingTop: 22,
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center gap-5">
        <AIEntryImage />
        <Text className="text-center text-[13px] font-bold leading-5 text-[#6A7080]">
          Bạn muốn mình hỗ trợ về điều gì?
        </Text>
      </View>

      <View className="gap-3">
        {optionCards.map((option) => {
          const optionIntent = isChatIntent(option.id) ? option.id : null;

          return (
            <Pressable
              accessibilityRole="button"
              className="min-h-[76px] flex-row items-center rounded-[4px] border border-[#F3F4F5] bg-card px-4 py-4"
              disabled={!option.enabled}
              key={option.title}
              onPress={
                option.enabled && optionIntent
                  ? () => onSelect(optionIntent)
                  : undefined
              }
              style={cardShadow}
            >
              <View
                className="h-[42px] w-[42px] items-center justify-center rounded-[12px]"
                style={{ backgroundColor: option.tone }}
              >
                <Feather
                  color={option.iconColor}
                  name={option.icon}
                  size={22}
                />
              </View>
              <View className="min-w-0 flex-1 px-4">
                <Text className="text-[14px] font-bold leading-5 text-[#585D6E]">
                  {option.title}
                </Text>
                <Text className="text-[12px] leading-[18px] text-[#9FA0B0]">
                  {option.subtitle}
                </Text>
              </View>
              <Feather color="#C6CAD3" name="chevron-right" size={20} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function ChatBubble({
  align,
  children,
}: {
  align: "user" | "assistant";
  children: ReactNode;
}) {
  const user = align === "user";
  return (
    <View
      className={`max-w-[86%] rounded-[7px] px-4 py-3 ${user ? "self-end bg-primary-600" : "self-start bg-primary-600"}`}
    >
      <Text className="text-[13px] leading-5 text-white">{children}</Text>
    </View>
  );
}

function RecipeSuggestionCard({
  onOpen,
  recipe,
}: {
  onOpen: () => void;
  recipe: MockRecipe;
}) {
  return (
    <View
      className="w-[90%] self-center overflow-hidden rounded-[14px] bg-[#DADADA] p-2"
      style={cardShadow}
    >
      <FoodImageWithSkeleton compact recipe={recipe} />

      <View className="mt-2 rounded-[16px] bg-white p-4">
        <Text className="text-[14px] font-bold leading-5 text-black">
          {recipe.name}
        </Text>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {recipe.chips.map((chip) => (
            <Chip key={chip} label={chip} solid />
          ))}
        </View>

        <View className="mt-3 flex-row border-t border-[#F2F2F2] pt-3">
          {recipe.previewNutrition.map(({ label, value }) => (
            <View className="flex-1" key={label}>
              <Text className="text-[14px] leading-5 text-black">{label}</Text>
              <Text className="text-[14px] font-bold leading-5 text-[#818182]">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="items-center py-3">
        <Pressable
          accessibilityRole="button"
          className="h-10 min-w-[210px] items-center justify-center rounded-[10px] bg-primary-600 px-5"
          onPress={onOpen}
        >
          <Text className="text-[14px] font-medium leading-5 text-white">
            Xem chi tiết công thức
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FoodImageWithSkeleton({
  compact = false,
  recipe,
}: {
  compact?: boolean;
  recipe: MockRecipe;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      className={`${
        compact ? "h-[148px]" : "h-[240px]"
      } overflow-hidden rounded-[16px] bg-[#E5E5E5]`}
    >
      {isLoading ? <ImageSkeleton /> : null}

      <Image
        accessibilityIgnoresInvertColors
        contentFit="cover"
        source={recipe.image}
        style={{
          height: "100%",
          width: "100%",
        }}
        transition={180}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}

function ImageSkeleton() {
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [shimmerTranslate]);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-240, 240],
  });

  return (
    <View className="absolute inset-0 z-10 overflow-hidden bg-[#E5E5E5]">
      <Animated.View
        className="absolute bottom-0 top-0 w-20 bg-white/40"
        style={{
          transform: [{ translateX }, { skewX: "-18deg" }],
        }}
      />
    </View>
  );
}

function ChatScreen({
  intent,
  keyboardHeight,
  messages,
  onOpenDetail,
  setMessages,
}: {
  intent: ChatIntent;
  keyboardHeight: number;
  messages: ChatMessage[];
  onOpenDetail: (recipeId: RecipeId) => void;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const isKeyboardOpen = keyboardHeight > 0;
  const bottomPadding = isKeyboardOpen
    ? keyboardHeight + (isVoiceRecording ? 144 : 112)
    : Math.max(
        insets.bottom + (isVoiceRecording ? 220 : 188),
        isVoiceRecording ? 248 : 216,
      );

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const normalized = normalizeForSearch(trimmed);
    const timestamp = Date.now().toString();
    const nextMessages: ChatMessage[] = [
      { id: `user-${timestamp}`, role: "user", text: trimmed },
    ];

    if (intent === "self-select") {
      const isBunBo = normalized.includes("bun bo");
      const bunBoRecipe = mockRecipes[BUN_BO_RECIPE_ID];

      nextMessages.push(
        isBunBo
          ? {
              id: `assistant-${timestamp}`,
              role: "assistant",
              text: bunBoRecipe.assistantIntro,
            }
          : {
              id: `assistant-${timestamp}`,
              role: "assistant",
              text: `Nutelyt v\u1eabn \u0111ang ph\u00e1t tri\u1ec3n, hi\u1ec7n ch\u01b0a c\u00f3 th\u00f4ng tin v\u1ec1 "${trimmed}". B\u1ea1n c\u00f3 th\u1ec3 th\u1eed nh\u1eadp "b\u00fan b\u00f2" \u0111\u1ec3 xem g\u1ee3i \u00fd m\u1eabu trong b\u1ea3n MVP.`,
            },
      );

      if (isBunBo) {
        nextMessages.push({
          id: `recipe-card-${BUN_BO_RECIPE_ID}-${timestamp}`,
          role: "assistant",
          type: "recipe-card",
          recipeId: BUN_BO_RECIPE_ID,
        });
      }
    } else if (isAlternateMealSuggestionRequest(normalized)) {
      nextMessages.push({
        id: `assistant-${timestamp}`,
        role: "assistant",
        text: alternateMealSuggestionIntro,
      });

      alternateMealSuggestionRecipeIds.forEach((recipeId) => {
        nextMessages.push({
          id: `recipe-card-${recipeId}-${timestamp}`,
          role: "assistant",
          type: "recipe-card",
          recipeId,
        });
      });
    } else if (isFirstMealSuggestionRequest(normalized)) {
      nextMessages.push({
        id: `assistant-${timestamp}`,
        role: "assistant",
        text: mealSuggestionIntro,
      });

      firstMealSuggestionRecipeIds.forEach((recipeId) => {
        nextMessages.push({
          id: `recipe-card-${recipeId}-${timestamp}`,
          role: "assistant",
          type: "recipe-card",
          recipeId,
        });
      });
    } else {
      nextMessages.push({
        id: `assistant-${timestamp}`,
        role: "assistant",
        text: `M\u00ecnh ch\u01b0a nh\u1eadn ra y\u00eau c\u1ea7u n\u00e0y. B\u1ea1n c\u00f3 th\u1ec3 th\u1eed nh\u1eadp "T\u00f4i mu\u1ed1n n\u1ea5u m\u1ed9t b\u1eefa \u0103n Vi\u1ec7t Nam c\u01a1 b\u1ea3n" \u0111\u1ec3 xem g\u1ee3i \u00fd m\u1eabu.`,
      });
    }

    setMessages((currentMessages) => [...currentMessages, ...nextMessages]);
    setInput("");
    setIsVoiceRecording(false);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  };

  const toggleVoiceRecording = () => {
    if (isVoiceRecording && !input.trim()) {
      setInput(
        intent === "meal-suggestion"
          ? "T\u00f4i mu\u1ed1n n\u1ea5u m\u1ed9t b\u1eefa \u0103n Vi\u1ec7t Nam c\u01a1 b\u1ea3n"
          : "T\u00f4i mu\u1ed1n n\u1ea5u b\u00fan b\u00f2",
      );
    }

    setIsVoiceRecording((current) => !current);
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{
          gap: 18,
          paddingBottom: bottomPadding,
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
            <Text className="text-center text-[24px] font-bold leading-8 text-[#404140]">
              Bạn muốn nấu món gì?
            </Text>
            <Text className="max-w-[270px] text-center text-[13px] leading-5 text-[#999B98]">
              Chia sẻ tên món ăn, mình sẽ phân tích dinh dưỡng giúp bạn.
            </Text>
          </View>
        </View>

        {messages.map((message) => {
          if ("type" in message) {
            const recipe = getMockRecipe(message.recipeId);

            return recipe ? (
              <RecipeSuggestionCard
                key={message.id}
                onOpen={() => onOpenDetail(recipe.id)}
                recipe={recipe}
              />
            ) : null;
          }

          return (
            <ChatBubble
              align={message.role === "user" ? "user" : "assistant"}
              key={message.id}
            >
              {message.text}
            </ChatBubble>
          );
        })}
      </ScrollView>

      <View
        className="absolute left-0 right-0 border-t border-[#E7ECE8] bg-background px-5 pt-3"
        style={{
          bottom: isKeyboardOpen
            ? keyboardHeight
            : Math.max(insets.bottom + 82, 96),
          paddingBottom: 12,
        }}
      >
        {isVoiceRecording ? (
          <View className="mb-2 self-start flex-row items-center gap-2 rounded-full bg-primary-50 px-3 py-1">
            <View className="h-2 w-2 rounded-full bg-primary-700" />
            <Text className="text-xs font-semibold leading-4 text-primary-700">
              Đang ghi âm...
            </Text>
          </View>
        ) : null}
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
            accessibilityLabel={
              isVoiceRecording ? "Dừng ghi âm thử" : "Bắt đầu ghi âm thử"
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isVoiceRecording }}
            className={`h-10 w-10 items-center justify-center rounded-full ${
              isVoiceRecording ? "bg-primary-700" : "bg-primary-50"
            }`}
            onPress={toggleVoiceRecording}
          >
            <Feather
              color={isVoiceRecording ? "#FFFFFF" : colors.primaryDark}
              name={isVoiceRecording ? "mic-off" : "mic"}
              size={18}
            />
          </Pressable>
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

function OverviewTab({ recipe }: { recipe: MockRecipe }) {
  return (
    <View className="gap-6">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">
        Đánh giá đối với sức khỏe
      </Text>
      <View className="gap-4">
        <Text className="text-base font-medium leading-6 text-[#4EB975]">
          Điểm tốt
        </Text>
        {recipe.overview.goodPoints.map((point) => (
          <View className="flex-row items-center gap-3" key={point}>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-100">
              <Feather color="#22C55E" name="check" size={14} />
            </View>
            <Text className="flex-1 text-base leading-6 text-[#90969E]">
              {point}
            </Text>
          </View>
        ))}
      </View>
      <View className="gap-4">
        <Text className="text-base font-bold leading-6 text-[#F37575]">
          Điểm cần lưu ý
        </Text>
        {recipe.overview.notes.map((note) => (
          <View className="flex-row items-center gap-3" key={note}>
            <View className="h-6 w-6 items-center justify-center rounded-full bg-[#FFEDEE]">
              <View className="h-2 w-2 rounded-full bg-[#F87171]" />
            </View>
            <Text className="flex-1 text-base leading-6 text-[#90969E]">
              {note}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function IngredientsTab({ recipe }: { recipe: MockRecipe }) {
  return (
    <View className="gap-5">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">
        Nguyên liệu chế biến
      </Text>
      <View className="flex-row flex-wrap gap-y-6">
        {recipe.ingredients.map((group) => (
          <View className="w-1/2 pr-3" key={group.title}>
            <Text className="text-base font-bold leading-6 text-black">
              {group.title}
            </Text>
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

function StepsTab({ recipe }: { recipe: MockRecipe }) {
  return (
    <View className="gap-5">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">
        Các bước thực hiện
      </Text>
      <View className="gap-2">
        {recipe.steps.map((step, index) => {
          const [title, ...body] = step.split(": ");
          return (
            <Text
              className="text-base leading-[23px] text-[#464343]"
              key={step}
            >
              <Text className="font-bold text-black">{index + 1}. </Text>
              <Text className="font-bold text-black">{title}: </Text>
              {body.join(": ")}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

function NutritionTab({ recipe }: { recipe: MockRecipe }) {
  return (
    <View className="gap-4">
      <Text className="text-[20px] font-bold leading-7 text-[#3F4854]">
        Bảng dinh dưỡng
      </Text>
      <View className="rounded-[12px] bg-white">
        <View className="flex-row pb-4">
          <Text
            className="text-base font-bold leading-6 text-[#3F4854]"
            style={{ flex: 1.35 }}
          >
            Thành phần
          </Text>
          <Text
            className="text-base font-bold leading-6 text-[#3F4854]"
            style={{ flex: 1 }}
          >
            Hàm lượng
          </Text>
          <Text
            className="text-base font-bold leading-6 text-[#3F4854]"
            style={{ flex: 0.75 }}
          >
            Giá trị
          </Text>
        </View>
        <View className="gap-4">
          {recipe.nutritionRows.map((row) => (
            <View className="flex-row" key={row.component}>
              <Text
                className="text-base leading-6 text-black"
                style={{ flex: 1.35 }}
              >
                {row.component}
              </Text>
              <Text
                className="text-base leading-6 text-black"
                style={{ flex: 1 }}
              >
                {row.amount}
              </Text>
              <Text
                className="text-base leading-6 text-black"
                style={{ flex: 0.75 }}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function RecipeDetailScreen({
  onBack,
  recipe,
}: {
  onBack: () => void;
  recipe: MockRecipe;
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecipeTab>("overview");
  const [saved, setSaved] = useState(false);
  const saveScale = useRef(new Animated.Value(1)).current;

  const tabContent = {
    overview: <OverviewTab recipe={recipe} />,
    ingredients: <IngredientsTab recipe={recipe} />,
    steps: <StepsTab recipe={recipe} />,
    nutrition: <NutritionTab recipe={recipe} />,
  }[activeTab];

  return (
    <View className="flex-1 bg-primary-600">
      <FoodPlaceholder recipe={recipe} />
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
            <Text className="text-[27px] font-bold leading-9 text-[#3C4551]">
              {recipe.name}
            </Text>
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
                    <Text
                      className={`text-base font-semibold leading-6 ${isActive ? "text-[#5D9372]" : "text-[#B8BDC6]"}`}
                    >
                      {tab.label}
                    </Text>
                    <View
                      className={`mt-[24px] h-[2px] w-full ${isActive ? "bg-primary-600" : "bg-transparent"}`}
                    />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <NutritionSummary
            fatValue={
              activeTab === "nutrition" ? recipe.summaryNutrition.fat : undefined
            }
            recipe={recipe}
          />
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
          onPressIn={() =>
            Animated.spring(saveScale, {
              damping: 12,
              stiffness: 260,
              toValue: 0.98,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.spring(saveScale, {
              damping: 12,
              stiffness: 260,
              toValue: 1,
              useNativeDriver: true,
            }).start()
          }
          style={[softShadow, { transform: [{ scale: saveScale }] }]}
        >
          <Text className="text-[17px] font-extrabold leading-6 text-white">
            {saved ? "Đã lưu công thức" : "Lưu công thức"}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export function ChatAIScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<ChatMode>("entry");
  const [chatIntent, setChatIntent] = useState<ChatIntent>("self-select");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] =
    useState<RecipeId>(BUN_BO_RECIPE_ID);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 220,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        damping: 18,
        stiffness: 150,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode, opacity, translateY]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

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

  const handleChatBack = () => {
    setMessages([]);
    setSelectedRecipeId(BUN_BO_RECIPE_ID);
    setMode("entry");
  };

  const handleDetailBack = () => {
    setSelectedRecipeId(BUN_BO_RECIPE_ID);
    setMode("chat");
  };

  const openChat = (intent: ChatIntent) => {
    setChatIntent(intent);
    setMessages([]);
    setSelectedRecipeId(BUN_BO_RECIPE_ID);
    setMode("chat");
  };

  const openRecipeDetail = (recipeId: RecipeId) => {
    setSelectedRecipeId(recipeId);
    setMode("detail");
  };

  const selectedRecipe =
    getMockRecipe(selectedRecipeId) ?? mockRecipes[BUN_BO_RECIPE_ID];

  if (mode === "detail") {
    return (
      <RecipeDetailScreen onBack={handleDetailBack} recipe={selectedRecipe} />
    );
  }

  return (
    <View className="flex-1 bg-background">
      {mode === "entry" ? (
        <MainScreenHeader
          align="center"
          subtitle="Sẵn sàng hỗ trợ bạn!"
          title="Trợ lý dinh dưỡng AI"
        />
      ) : (
        <ChatHeader onBack={handleChatBack} showBack topInset={insets.top} />
      )}
      <Animated.View
        className="flex-1"
        style={{ opacity, transform: [{ translateY }] }}
      >
        {mode === "entry" ? (
          <EntryScreen onSelect={openChat} />
        ) : (
          <ChatScreen
            intent={chatIntent}
            keyboardHeight={keyboardHeight}
            messages={messages}
            onOpenDetail={openRecipeDetail}
            setMessages={setMessages}
          />
        )}
      </Animated.View>
    </View>
  );
}
