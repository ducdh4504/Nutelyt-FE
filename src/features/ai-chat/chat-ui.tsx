import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageWithSkeleton, Shimmer } from '@/components/ui';
import type { ChatMessage, ConversationListItem, FoodAnalysisContent, RecipeRecommendationContent, ActivitySuggestionContent } from '@/features/ai-chat/ai-chat.types';
import { colors } from '@/theme/tokens';

const cardShadow = { boxShadow: '0 8px 20px rgba(26, 28, 30, 0.07)' };

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLocaleLowerCase('vi-VN');
}

function conversationGroup(value: string) {
  const current = new Date();
  const target = new Date(value);
  const today = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
  const yesterday = today - 86400000;
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  if (targetDay === today) return 'Hôm nay';
  if (targetDay === yesterday) return 'Hôm qua';
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long' }).format(target);
}

export function ChatHeader({ onNewConversation, onOpenSidebar }: { onNewConversation: () => void; onOpenSidebar: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row items-center border-b border-[#E5EEE7] bg-card px-5" style={{ minHeight: Math.max(insets.top + 62, 82), paddingTop: insets.top + 8 }}>
      <Pressable accessibilityLabel="Mở danh sách cuộc trò chuyện" accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-full bg-primary-50" onPress={onOpenSidebar}><Feather color={colors.primaryDark} name="menu" size={21} /></Pressable>
      <View className="flex-1 items-center px-3"><Text className="text-base font-bold text-foreground">Nutelyt AI</Text><View className="mt-1 flex-row items-center gap-1"><View className="h-1.5 w-1.5 rounded-full bg-primary-600" /><Text className="text-xs font-medium text-primary-700">Sẵn sàng hỗ trợ</Text></View></View>
      <Pressable accessibilityLabel="Tạo cuộc trò chuyện mới" accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-full bg-primary-600" onPress={onNewConversation}><Feather color="#FFFFFF" name="edit-3" size={18} /></Pressable>
    </View>
  );
}

export function ChatWelcome({ displayName, onPrompt, prompts }: { displayName: string; onPrompt: (prompt: string) => void; prompts: string[] }) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-6 pb-6">
      <View accessibilityElementsHidden className="h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-primary-100 bg-primary-50" style={cardShadow}>
        <Image contentFit="contain" source={require('@assets/images/Nutelyt-AI.png')} style={{ height: 104, width: 104 }} />
      </View>
      <View className="items-center gap-2"><Text className="text-center text-2xl font-semibold text-foreground">Chào {displayName}!</Text><Text className="max-w-[300px] text-center text-base leading-6 text-muted">Mình là Nutelyt, người đồng hành dinh dưỡng cho mục tiêu giảm cân của bạn.</Text></View>
      <View className="w-full gap-2">{prompts.map((prompt) => <Pressable accessibilityLabel={`Gửi gợi ý: ${prompt}`} accessibilityRole="button" className="min-h-12 rounded-2xl border border-primary-100 bg-card px-4" key={prompt} onPress={() => onPrompt(prompt)} style={cardShadow}><Text className="pt-3 text-sm font-semibold text-primary-700">{prompt}</Text></Pressable>)}</View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  if (message.content.kind !== 'text') return null;
  return <View className={`max-w-[86%] rounded-[20px] px-4 py-3 ${isUser ? 'self-end bg-primary-600' : 'self-start bg-card'}`} style={isUser ? undefined : cardShadow}><Text className={`text-[15px] leading-6 ${isUser ? 'text-white' : 'text-foreground'}`}>{message.content.text}</Text></View>;
}

function RecipeCard({ content, onLogMeal, onSave, onViewRecipe }: { content: RecipeRecommendationContent; onLogMeal: (id: string) => void; onSave: (id: string) => void; onViewRecipe: () => void }) {
  return <View className="overflow-hidden rounded-[22px] bg-card" style={cardShadow}>
    <ImageWithSkeleton accessibilityLabel={content.title} borderRadius={0} height={156} source={content.image} width="100%" />
    <View className="gap-3 p-4"><View className="gap-1"><Text className="text-lg font-semibold text-foreground">{content.title}</Text><Text className="text-sm leading-5 text-muted">{content.description}</Text></View><View className="flex-row flex-wrap gap-2">{content.tags.map((tag) => <View className="rounded-full bg-primary-50 px-2.5 py-1" key={tag}><Text className="text-xs font-semibold text-primary-700">{tag}</Text></View>)}</View><View className="flex-row rounded-xl bg-[#F6F9F6] py-3"><View className="flex-1 items-center"><Text className="text-xs text-muted">Năng lượng</Text><Text className="text-sm font-bold text-foreground">{content.calories} kcal</Text></View><View className="flex-1 items-center border-l border-[#DFE9E0]"><Text className="text-xs text-muted">Protein</Text><Text className="text-sm font-bold text-foreground">{content.proteinGrams}g</Text></View></View><Text className="text-xs leading-5 text-primary-700">{content.personalizationNote}</Text><View className="rounded-xl bg-warning-50 p-3"><Text className="text-xs leading-5 text-muted">{content.warning}</Text></View><View className="flex-row gap-2"><Pressable accessibilityLabel={`Lưu ${content.title}`} accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-xl bg-primary-50" onPress={() => onSave(content.recommendationId)}><Feather color={colors.primaryDark} name="bookmark" size={18} /></Pressable><Pressable accessibilityRole="button" className="h-11 flex-1 items-center justify-center rounded-xl bg-primary-50" onPress={onViewRecipe}><Text className="text-sm font-semibold text-primary-700">Xem công thức</Text></Pressable></View><Pressable accessibilityLabel={`Ghi nhận đã ăn ${content.title}`} accessibilityRole="button" className="h-12 items-center justify-center rounded-xl bg-primary-600" onPress={() => onLogMeal(content.recommendationId)}><Text className="text-sm font-semibold text-white">Ghi nhận đã ăn</Text></Pressable></View>
  </View>;
}

function AnalysisCard({ content, onLogMeal, onSave }: { content: FoodAnalysisContent; onLogMeal: (id: string) => void; onSave: (id: string) => void }) {
  const suitable = content.suitability === 'suitable-with-notes';
  return <View className="overflow-hidden rounded-[22px] bg-card" style={cardShadow}><ImageWithSkeleton accessibilityLabel={content.title} borderRadius={0} height={132} source={content.image} width="100%" /><View className="gap-3 p-4"><View><Text className="text-lg font-semibold text-foreground">{content.title}</Text><Text className="text-sm text-muted">{content.portion} · {content.calories} kcal · {content.proteinGrams}g protein</Text></View><View className={`rounded-xl p-3 ${suitable ? 'bg-primary-50' : 'bg-warning-50'}`}><Text className={`text-sm font-semibold ${suitable ? 'text-primary-700' : 'text-warning-600'}`}>{suitable ? 'Phù hợp nếu điều chỉnh khẩu phần' : 'Cần lưu ý với hồ sơ hiện tại'}</Text></View><View className="gap-1"><Text className="text-sm font-semibold text-foreground">Điểm phù hợp</Text>{content.strengths.map((item) => <Text className="text-sm leading-5 text-muted" key={item}>• {item}</Text>)}</View><View className="gap-1"><Text className="text-sm font-semibold text-foreground">Điểm cần lưu ý</Text>{content.cautions.map((item) => <Text className="text-sm leading-5 text-muted" key={item}>• {item}</Text>)}</View><View className="flex-row gap-2"><Pressable accessibilityLabel={`Lưu ${content.title}`} accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-xl bg-primary-50" onPress={() => onSave(content.recommendationId)}><Feather color={colors.primaryDark} name="bookmark" size={18} /></Pressable><Pressable accessibilityLabel={`Ghi nhận đã ăn ${content.title}`} accessibilityRole="button" className="h-11 flex-1 items-center justify-center rounded-xl bg-primary-600" onPress={() => onLogMeal(content.recommendationId)}><Text className="text-sm font-semibold text-white">Ghi nhận đã ăn</Text></Pressable></View></View></View>;
}

function ActivityCard({ content, onLogActivity }: { content: ActivitySuggestionContent; onLogActivity: (input: { caloriesEstimate: number; durationMinutes: number; id: string; name?: string }) => void }) {
  return <View className="gap-3 rounded-[22px] bg-card p-4" style={cardShadow}><View className="flex-row items-center gap-3"><View accessibilityElementsHidden className="h-12 w-12 items-center justify-center rounded-full bg-primary-50"><Feather color={colors.primaryDark} name="activity" size={22} /></View><View className="flex-1"><Text className="text-lg font-semibold text-foreground">{content.title}</Text><Text className="text-sm text-muted">{content.durationMinutes} phút · cường độ nhẹ · ~{content.caloriesEstimate} kcal</Text></View></View><Text className="text-sm leading-5 text-muted">{content.instructions}</Text><Pressable accessibilityLabel={`Ghi nhận đã tập ${content.title}`} accessibilityRole="button" className="h-12 items-center justify-center rounded-xl bg-primary-600" onPress={() => onLogActivity({ caloriesEstimate: content.caloriesEstimate, durationMinutes: content.durationMinutes, id: content.id, name: content.title })}><Text className="text-sm font-semibold text-white">Ghi nhận đã tập</Text></Pressable></View>;
}

export function ChatMessageList({ actionError, failed, isSending, messages, onLogActivity, onLogMeal, onRetry, onSave, onViewRecipe }: { actionError: string | null; failed: boolean; isSending: boolean; messages: ChatMessage[]; onLogActivity: (input: { caloriesEstimate: number; durationMinutes: number; id: string; name?: string }) => void; onLogMeal: (id: string) => void; onRetry: () => void; onSave: (id: string) => void; onViewRecipe: () => void }) {
  const listRef = useRef<FlatList<ChatMessage>>(null);
  useEffect(() => { if (messages.length || isSending) requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true })); }, [isSending, messages.length]);
  return <FlatList ref={listRef} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingTop: 20 }} data={messages} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" renderItem={({ item }) => { if (item.content.kind === 'text') return <MessageBubble message={item} />; if (item.content.kind === 'recipe-recommendation') return <RecipeCard content={item.content} onLogMeal={onLogMeal} onSave={onSave} onViewRecipe={onViewRecipe} />; if (item.content.kind === 'food-analysis') return <AnalysisCard content={item.content} onLogMeal={onLogMeal} onSave={onSave} />; return <ActivityCard content={item.content} onLogActivity={onLogActivity} />; }} ListFooterComponent={<View className="gap-3">{isSending ? <View className="self-start rounded-2xl bg-card px-4 py-3" style={cardShadow}><View className="flex-row items-center gap-2"><Shimmer borderRadius={5} height={8} width={8} /><Shimmer borderRadius={5} height={8} width={8} /><Shimmer borderRadius={5} height={8} width={8} /><Text className="ml-1 text-sm text-muted">Nutelyt đang suy nghĩ...</Text></View></View> : null}{failed ? <View className="gap-2 rounded-2xl border border-warning-100 bg-warning-50 p-4"><Text className="text-sm font-semibold text-foreground">Nutelyt chưa thể phản hồi.</Text><Text className="text-sm leading-5 text-muted">Tin nhắn của bạn vẫn được giữ lại. Hãy thử lại.</Text><Pressable accessibilityRole="button" className="self-start rounded-xl bg-primary-600 px-4 py-3" onPress={onRetry}><Text className="text-sm font-semibold text-white">Thử lại</Text></Pressable></View> : null}{actionError ? <Text accessibilityLiveRegion="polite" className="text-sm text-[#B45309]">{actionError}</Text> : null}</View>} showsVerticalScrollIndicator={false} />;
}

export function ChatComposer({ disabled, onSend }: { disabled: boolean; onSend: (text: string) => Promise<boolean> }) {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState('');
  const send = async () => { const trimmed = value.trim(); if (!trimmed || disabled) return; if (await onSend(trimmed)) setValue(''); };
  return <View className="border-t border-[#E5EEE7] bg-card px-4 pt-3" style={{ paddingBottom: Math.max(insets.bottom + 78, 92) }}><View className="flex-row items-end gap-2"><Pressable accessibilityLabel="Camera chưa khả dụng" accessibilityRole="button" accessibilityState={{ disabled: true }} className="h-11 w-11 items-center justify-center rounded-full bg-primary-50" disabled><Feather color="#9DB7A4" name="camera" size={19} /></Pressable><TextInput accessibilityLabel="Soạn tin nhắn cho Nutelyt" className="min-h-11 max-h-28 flex-1 rounded-[20px] bg-[#F4F7F4] px-4 py-3 text-base text-foreground" editable={!disabled} multiline onChangeText={setValue} placeholder="Hỏi Nutelyt về bữa ăn của bạn..." placeholderTextColor="#778478" value={value} /><Pressable accessibilityLabel="Nhập giọng nói chưa khả dụng" accessibilityRole="button" accessibilityState={{ disabled: true }} className="h-11 w-11 items-center justify-center rounded-full bg-primary-50" disabled><Feather color="#9DB7A4" name="mic" size={19} /></Pressable><Pressable accessibilityLabel="Gửi tin nhắn" accessibilityRole="button" accessibilityState={{ disabled: disabled || !value.trim() }} className={`h-11 w-11 items-center justify-center rounded-full ${disabled || !value.trim() ? 'bg-primary-100' : 'bg-primary-600'}`} disabled={disabled || !value.trim()} onPress={() => { void send(); }}><Feather color={disabled || !value.trim() ? '#70947B' : '#FFFFFF'} name="send" size={18} /></Pressable></View><Text className="mt-2 text-center text-xs text-muted">Camera và giọng nói sẽ sớm được hỗ trợ.</Text></View>;
}

export function ConversationSidebar({ activeId, conversations, onClose, onCreate, onSelect, visible }: { activeId: string; conversations: ConversationListItem[]; onClose: () => void; onCreate: () => void; onSelect: (id: string) => void; visible: boolean }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => conversations.filter((item) => normalize(item.title).includes(normalize(search))), [conversations, search]);
  const groups = useMemo(() => filtered.reduce<Record<string, ConversationListItem[]>>((all, item) => ({ ...all, [conversationGroup(item.updatedAt)]: [...(all[conversationGroup(item.updatedAt)] ?? []), item] }), {}), [filtered]);
  return <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}><View className="flex-1 flex-row"><View className="w-[86%] max-w-[360px] bg-background px-5 pt-14"><View className="mb-5 flex-row items-center justify-between"><Text className="text-xl font-semibold text-foreground">Cuộc trò chuyện</Text><Pressable accessibilityLabel="Đóng danh sách cuộc trò chuyện" accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-full bg-primary-50" onPress={onClose}><Feather color={colors.primaryDark} name="x" size={20} /></Pressable></View><Pressable accessibilityRole="button" className="mb-4 h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary-600" onPress={onCreate}><Feather color="#FFFFFF" name="plus" size={18} /><Text className="text-sm font-semibold text-white">Cuộc trò chuyện mới</Text></Pressable><View className="mb-4 flex-row items-center rounded-xl bg-card px-3" style={cardShadow}><Feather color="#778478" name="search" size={18} /><TextInput accessibilityLabel="Tìm kiếm cuộc trò chuyện" className="h-12 flex-1 px-3 text-base text-foreground" onChangeText={setSearch} placeholder="Tìm cuộc trò chuyện" placeholderTextColor="#778478" value={search} /></View><FlatList data={Object.entries(groups)} keyExtractor={([title]) => title} renderItem={({ item: [title, items] }) => <View className="mb-4 gap-2"><Text className="text-sm font-semibold text-muted">{title}</Text>{items.map((conversation) => <Pressable accessibilityLabel={`Mở ${conversation.title}`} accessibilityRole="button" accessibilityState={{ selected: conversation.id === activeId }} className={`rounded-xl p-3 ${conversation.id === activeId ? 'bg-primary-50' : 'bg-card'}`} key={conversation.id} onPress={() => { onSelect(conversation.id); onClose(); }} style={cardShadow}><Text className="text-sm font-semibold text-foreground" numberOfLines={1}>{conversation.title}</Text><Text className="mt-1 text-xs text-muted">{new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(conversation.updatedAt))}</Text></Pressable>)}</View>} ListEmptyComponent={<Text className="py-8 text-center text-sm text-muted">Không tìm thấy cuộc trò chuyện.</Text>} showsVerticalScrollIndicator={false} /></View><Pressable accessibilityLabel="Đóng danh sách cuộc trò chuyện" accessibilityRole="button" className="flex-1 bg-black/35" onPress={onClose} /></View></Modal>;
}

export function ChatWorkspaceShell({ children }: { children: ReactNode }) {
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">{children}</KeyboardAvoidingView>;
}
