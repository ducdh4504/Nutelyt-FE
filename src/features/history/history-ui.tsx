import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ComponentProps } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImageWithSkeleton, Shimmer } from '@/components/ui';
import { routes } from '@/config/routes';
import { formatHistoryTime } from '@/features/history/history-filtering';
import type { HistoryCategory, HistoryEntry, HistoryFilters, HistoryTimeRange } from '@/features/history/history.types';
import { colors } from '@/theme/tokens';

type FeatherName = ComponentProps<typeof Feather>['name'];

const cardShadow = { boxShadow: '0 8px 20px rgba(26, 28, 30, 0.06)' };
const categoryOptions: { label: string; value: HistoryCategory }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Bữa ăn', value: 'meal' },
  { label: 'Hoạt động', value: 'activity' },
  { label: 'Đã lưu', value: 'saved' },
];
const rangeOptions: { detail: string; label: string; value: HistoryTimeRange }[] = [
  { detail: 'Chỉ các hoạt động trong ngày', label: 'Hôm nay', value: 'today' },
  { detail: 'Từ hôm nay trở về 6 ngày trước', label: '7 ngày gần đây', value: 'last-7-days' },
  { detail: 'Từ hôm nay trở về 29 ngày trước', label: '30 ngày gần đây', value: 'last-30-days' },
];

function entryVisual(entry: HistoryEntry): { icon: FeatherName; label: string; meta: string } {
  if (entry.kind === 'meal') return { icon: 'check-circle', label: 'Đã ăn', meta: `${entry.calories} kcal · ${entry.proteinGrams}g protein` };
  if (entry.kind === 'activity') return { icon: 'activity', label: 'Đã hoàn thành', meta: `${entry.durationMinutes} phút · ~${entry.caloriesEstimate} kcal` };
  return { icon: 'bookmark', label: 'Đã lưu', meta: 'Món ăn để xem lại sau' };
}

export function HistoryToolbar({ filters, onCategoryChange, onFilterPress, onQueryChange }: {
  filters: HistoryFilters;
  onCategoryChange: (category: HistoryCategory) => void;
  onFilterPress: () => void;
  onQueryChange: (query: string) => void;
}) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[28px] font-semibold leading-9 text-foreground">Lịch sử</Text>
        <Text className="text-base leading-6 text-muted">Theo dõi bữa ăn, hoạt động và món đã lưu.</Text>
      </View>
      <View className="flex-row gap-3">
        <View className="h-14 flex-1 flex-row items-center rounded-2xl bg-card px-4" style={cardShadow}>
          <Feather color="#68756A" name="search" size={19} />
          <TextInput
            accessibilityLabel="Tìm kiếm lịch sử"
            className="ml-3 flex-1 text-base text-foreground"
            onChangeText={onQueryChange}
            placeholder="Tìm bữa ăn hoặc hoạt động"
            placeholderTextColor="#68756A"
            returnKeyType="search"
            value={filters.query}
          />
        </View>
        <Pressable
          accessibilityLabel="Mở bộ lọc lịch sử"
          accessibilityRole="button"
          className="h-14 w-14 items-center justify-center rounded-2xl bg-card"
          onPress={onFilterPress}
          style={cardShadow}
        >
          <Feather color={colors.primaryDark} name="sliders" size={20} />
        </Pressable>
      </View>
      <View accessibilityRole="tablist" className="flex-row flex-wrap gap-2">
        {categoryOptions.map((option) => {
          const selected = filters.category === option.value;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              className={`min-h-10 rounded-full px-4 ${selected ? 'bg-primary-600' : 'bg-card'}`}
              key={option.value}
              onPress={() => onCategoryChange(option.value)}
              style={selected ? undefined : cardShadow}
            >
              <Text className={`pt-2 text-sm font-semibold ${selected ? 'text-white' : 'text-muted'}`}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function HistoryEntryCard({ entry }: { entry: HistoryEntry }) {
  const visual = entryVisual(entry);
  const hasImage = entry.kind !== 'activity';
  return (
    <View className="min-h-[96px] flex-row items-center gap-3 rounded-[20px] bg-card p-3" style={cardShadow}>
      {hasImage ? (
        <ImageWithSkeleton accessibilityLabel={entry.title} borderRadius={14} height={72} source={entry.image} width={72} />
      ) : (
        <View accessibilityElementsHidden className="h-[72px] w-[72px] items-center justify-center rounded-[14px] bg-primary-50">
          <Feather color={colors.primaryDark} name="activity" size={28} />
        </View>
      )}
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-base font-semibold leading-5 text-foreground" numberOfLines={2}>{entry.title}</Text>
        <Text className="text-sm leading-5 text-muted" numberOfLines={1}>{visual.meta}</Text>
        <View className="self-start flex-row items-center gap-1 rounded-full bg-primary-50 px-2 py-1">
          <Feather color={colors.primaryDark} name={visual.icon} size={12} />
          <Text className="text-xs font-semibold text-primary-700">{visual.label}</Text>
        </View>
      </View>
      <Text selectable className="self-start pt-1 text-xs font-medium text-muted">{formatHistoryTime(entry.occurredAt)}</Text>
    </View>
  );
}

export function HistoryLoading() {
  return (
    <View className="flex-1 gap-6 bg-background px-5 pt-8">
      <View className="gap-2"><Shimmer borderRadius={10} height={32} width={128} /><Shimmer borderRadius={8} height={20} width="78%" /></View>
      <View className="flex-row gap-3"><Shimmer borderRadius={16} height={56} /><Shimmer borderRadius={16} height={56} width={56} /></View>
      <View className="flex-row gap-2"><Shimmer borderRadius={20} height={40} width={76} /><Shimmer borderRadius={20} height={40} width={86} /><Shimmer borderRadius={20} height={40} width={96} /></View>
      <View className="gap-3"><Shimmer borderRadius={9} height={18} width={74} /><Shimmer borderRadius={20} height={96} /><Shimmer borderRadius={20} height={96} /><Shimmer borderRadius={20} height={96} /></View>
    </View>
  );
}

export function HistoryEmptyState({ error, onRetry, filtered, onReset }: {
  error?: boolean;
  filtered?: boolean;
  onReset?: () => void;
  onRetry?: () => void;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const title = error ? 'Không thể tải lịch sử' : filtered ? 'Không tìm thấy kết quả' : 'Chưa có hoạt động nào';
  const description = error
    ? 'Vui lòng kiểm tra kết nối và thử lại.'
    : filtered
      ? 'Hãy thay đổi từ khóa hoặc bộ lọc để xem các hoạt động khác.'
      : 'Khi bạn ghi nhận bữa ăn, hoàn thành hoạt động hoặc lưu món, chúng sẽ xuất hiện ở đây.';
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-7" style={{ paddingBottom: insets.bottom + 104, paddingTop: insets.top + 24 }}>
      <View accessibilityElementsHidden className="h-20 w-20 items-center justify-center rounded-full bg-primary-50">
        <Feather color={colors.primaryDark} name={error ? 'wifi-off' : filtered ? 'search' : 'clock'} size={34} />
      </View>
      <View className="gap-2"><Text className="text-center text-xl font-semibold text-foreground">{title}</Text><Text className="text-center text-base leading-6 text-muted">{description}</Text></View>
      {error ? <Pressable accessibilityRole="button" className="min-h-12 rounded-xl bg-primary-600 px-5" onPress={onRetry}><Text className="pt-3 text-sm font-semibold text-white">Thử lại</Text></Pressable> : null}
      {filtered ? <Pressable accessibilityRole="button" className="min-h-12 rounded-xl bg-primary-600 px-5" onPress={onReset}><Text className="pt-3 text-sm font-semibold text-white">Xóa bộ lọc</Text></Pressable> : null}
      {!error && !filtered ? (
        <View className="flex-row gap-5"><Pressable accessibilityRole="button" onPress={() => router.navigate(routes.home)}><Text className="text-sm font-semibold text-primary-700">Về trang chủ</Text></Pressable><Pressable accessibilityRole="button" onPress={() => router.navigate(routes.chatAi)}><Text className="text-sm font-semibold text-primary-700">Trò chuyện với Nutelyt</Text></Pressable></View>
      ) : null}
    </View>
  );
}

export function HistoryFilterSheet({ draft, onApply, onClose, onDraftChange, onReset, visible }: {
  draft: HistoryFilters;
  onApply: () => void;
  onClose: () => void;
  onDraftChange: (filters: HistoryFilters) => void;
  onReset: () => void;
  visible: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable accessibilityRole="button" className="flex-1 bg-black/35" onPress={onClose} />
      <View className="rounded-t-[28px] bg-card px-5 pt-4" style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}>
        <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-[#D7E1D8]" />
        <View className="mb-5 flex-row items-center justify-between"><Text className="text-xl font-semibold text-foreground">Lọc lịch sử</Text><Pressable accessibilityLabel="Đóng bộ lọc" accessibilityRole="button" className="h-11 w-11 items-center justify-center rounded-full bg-primary-50" onPress={onClose}><Feather color={colors.primaryDark} name="x" size={20} /></Pressable></View>
        <View className="gap-3"><Text className="text-sm font-semibold text-muted">Loại hoạt động</Text><View className="flex-row flex-wrap gap-2">{categoryOptions.map((option) => { const selected = draft.category === option.value; return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} className={`min-h-10 rounded-full px-4 ${selected ? 'bg-primary-600' : 'bg-primary-50'}`} key={option.value} onPress={() => onDraftChange({ ...draft, category: option.value })}><Text className={`pt-2 text-sm font-semibold ${selected ? 'text-white' : 'text-primary-700'}`}>{option.label}</Text></Pressable>; })}</View></View>
        <View className="mt-6 gap-3"><Text className="text-sm font-semibold text-muted">Khoảng thời gian</Text>{rangeOptions.map((option) => { const selected = draft.range === option.value; return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} className={`min-h-[58px] flex-row items-center rounded-2xl border px-4 ${selected ? 'border-primary-600 bg-primary-50' : 'border-[#E5EEE7] bg-card'}`} key={option.value} onPress={() => onDraftChange({ ...draft, range: option.value })}><View className={`mr-3 h-5 w-5 rounded-full border-2 ${selected ? 'border-primary-600' : 'border-[#A4B2A6]'}`}>{selected ? <View className="m-1 h-2.5 w-2.5 rounded-full bg-primary-600" /> : null}</View><View className="flex-1"><Text className="text-base font-semibold text-foreground">{option.label}</Text><Text className="text-xs text-muted">{option.detail}</Text></View></Pressable>; })}</View>
        <View className="mt-7 flex-row gap-3"><Pressable accessibilityRole="button" className="h-14 flex-1 items-center justify-center rounded-2xl bg-primary-50" onPress={onReset}><Text className="text-base font-semibold text-primary-700">Đặt lại</Text></Pressable><Pressable accessibilityRole="button" className="h-14 flex-1 items-center justify-center rounded-2xl bg-primary-600" onPress={onApply}><Text className="text-base font-semibold text-white">Áp dụng</Text></Pressable></View>
      </View>
    </Modal>
  );
}
