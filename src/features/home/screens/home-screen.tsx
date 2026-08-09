import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/config/routes';
import { Shimmer } from '@/components/ui';
import { useHomeActions } from '@/features/home/hooks/use-home-actions';
import { useHomeSnapshot } from '@/features/home/hooks/use-home-snapshot';
import { useHomeTime } from '@/features/home/hooks/use-home-time';
import type { HomeProfileContext, MealRecommendation } from '@/features/home/home.types';
import { useMainProfile } from '@/features/profile';
import { colors } from '@/theme/tokens';

const knownDiets = new Set(['standard', 'vegetarian', 'vegan', 'low-carb', 'high-protein', 'other']);

function toHomeProfileContext(profile: ReturnType<typeof useMainProfile>['profile']): HomeProfileContext {
  const displayName = profile.fullName.trim();
  const diet = profile.diet && knownDiets.has(profile.diet) ? profile.diet : null;
  return {
    allergies: profile.allergies ?? profile.allergyText.split(',').map((item) => item.trim()).filter(Boolean),
    diet,
    displayName: displayName && displayName !== 'Người dùng Nutelyt' ? displayName : 'bạn',
  } as HomeProfileContext;
}

function ProgressCard({ activityMinutes, mealGoal, mealsLogged }: { activityMinutes: number; mealGoal: number; mealsLogged: number }) {
  const progress = Math.min(mealsLogged / mealGoal, 1);
  return (
    <View className="gap-4 rounded-[24px] bg-primary-700 p-5" style={styles.progressShadow}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold text-white">Tiến độ hôm nay</Text>
          <Text className="text-sm leading-5 text-white/80">Mỗi bữa ăn được ghi nhận giúp bạn theo dõi đều đặn hơn.</Text>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <Feather color="#FFFFFF" name="target" size={21} />
        </View>
      </View>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-white/80">Bữa ăn đã ghi nhận</Text>
          <Text selectable className="text-base font-bold text-white" style={styles.tabular}>{mealsLogged}/{mealGoal}</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-white/20">
          <View className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Feather color="#FFFFFF" name="activity" size={16} />
        <Text selectable className="text-sm font-medium text-white">Hoạt động: {activityMinutes} phút</Text>
      </View>
    </View>
  );
}

function RecommendationCard({
  item,
  onBookmark,
  onLog,
  pending,
}: {
  item: MealRecommendation;
  onBookmark: () => void;
  onLog: () => void;
  pending: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <View className="mr-4 w-[264px] overflow-hidden rounded-[20px] bg-card" style={styles.cardShadow}>
      <View className="h-36 overflow-hidden bg-primary-50">
        {imageFailed ? (
          <View accessibilityElementsHidden className="h-full w-full items-center justify-center bg-primary-50">
            <Feather color={colors.primaryDark} name="coffee" size={30} />
          </View>
        ) : (
          <Image accessibilityLabel={item.name} className="h-full w-full" contentFit="cover" onError={() => setImageFailed(true)} source={item.image} transition={160} />
        )}
        <View className="absolute bottom-3 left-3 rounded-full bg-card px-3 py-1.5">
          <Text selectable className="text-xs font-bold text-foreground">{item.nutrition.calories} kcal</Text>
        </View>
        <Pressable
          accessibilityLabel={item.isSaved ? `Bỏ lưu ${item.name}` : `Lưu ${item.name}`}
          accessibilityRole="button"
          accessibilityState={{ selected: item.isSaved }}
          className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-card"
          disabled={pending}
          hitSlop={4}
          onPress={onBookmark}
        >
          <Feather color={item.isSaved ? colors.primaryDark : '#3D4A3F'} fill={item.isSaved ? colors.primaryDark : 'none'} name="bookmark" size={18} />
        </Pressable>
      </View>
      <View className="gap-3 p-4">
        <View className="gap-1">
          <Text className="text-base font-semibold leading-6 text-foreground" numberOfLines={2}>{item.name}</Text>
          <Text className="text-sm leading-5 text-muted" numberOfLines={2}>{item.description}</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag) => <View className="rounded-full bg-primary-50 px-2.5 py-1" key={tag}><Text className="text-xs font-semibold text-primary-700">{tag}</Text></View>)}
        </View>
        <Pressable
          accessibilityLabel={item.isLogged ? `${item.name} đã được ghi nhận` : `Ghi nhận đã ăn ${item.name}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: item.isLogged || pending }}
          className={`min-h-12 flex-row items-center justify-center gap-2 rounded-xl ${item.isLogged ? 'bg-primary-50' : 'bg-primary-600'}`}
          disabled={item.isLogged || pending}
          onPress={onLog}
        >
          <Feather color={item.isLogged ? colors.primaryDark : '#FFFFFF'} name={item.isLogged ? 'check' : 'plus'} size={17} />
          <Text className={`text-sm font-semibold ${item.isLogged ? 'text-primary-700' : 'text-white'}`}>{pending ? 'Đang ghi nhận...' : item.isLogged ? 'Đã ghi nhận' : 'Ghi nhận đã ăn'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function HomeLoading() {
  return <View className="gap-5 px-5 pt-6"><Shimmer borderRadius={20} height={172} /><View className="flex-row gap-4"><Shimmer borderRadius={20} height={330} width={264} /><Shimmer borderRadius={20} height={330} width={264} /></View></View>;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useMainProfile();
  const now = useHomeTime();
  const profileContext = useMemo(() => toHomeProfileContext(profile), [profile]);
  const snapshotQuery = useHomeSnapshot(profileContext, now);
  const { logActivity, logMeal, save, unsave } = useHomeActions();
  const locks = useRef(new Set<string>());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const snapshot = snapshotQuery.data;

  const runAction = async (id: string, action: () => Promise<unknown>) => {
    if (locks.current.has(id)) return;
    locks.current.add(id);
    setPendingId(id);
    setActionError(null);
    try {
      await action();
    } catch {
      setActionError('Không thể cập nhật lúc này. Vui lòng thử lại.');
    } finally {
      locks.current.delete(id);
      setPendingId(null);
    }
  };

  if (snapshotQuery.isPending) return <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}><HomeLoading /></View>;

  if (!snapshot) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background px-6" style={{ paddingBottom: insets.bottom + 92, paddingTop: insets.top }}>
        <Feather color={colors.primaryDark} name="coffee" size={34} />
        <Text className="text-center text-xl font-semibold text-foreground">Nutelyt chưa thể tải gợi ý</Text>
        <Text className="text-center text-base leading-6 text-muted">Bạn vẫn có thể trò chuyện với Nutelyt để chọn món phù hợp.</Text>
        <Pressable accessibilityRole="button" className="h-12 rounded-xl bg-primary-600 px-5" onPress={() => snapshotQuery.refetch()}><Text className="pt-3 text-sm font-semibold text-white">Thử lại</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.navigate(routes.chatAi)}><Text className="text-sm font-semibold text-primary-700">Trò chuyện với Nutelyt</Text></Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ gap: 24, paddingBottom: Math.max(insets.bottom + 106, 132), paddingHorizontal: 20, paddingTop: Math.max(insets.top + 12, 26) }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-base font-medium text-muted">{snapshot.greeting}, {profileContext.displayName}</Text>
            <Text className="text-[28px] font-semibold leading-9 text-foreground">Hôm nay bạn muốn ăn gì?</Text>
          </View>
          <Pressable accessibilityLabel="Thông báo" accessibilityRole="button" className="h-12 w-12 items-center justify-center rounded-full bg-card" onPress={() => setNotificationMessage('Thông báo sẽ sớm có mặt.')} style={styles.cardShadow}>
            <Feather color={colors.primaryDark} name="bell" size={20} />
          </Pressable>
        </View>
        {notificationMessage ? <Text accessibilityLiveRegion="polite" className="-mt-3 text-sm text-muted">{notificationMessage}</Text> : null}

        <ProgressCard {...snapshot.dailyProgress} />

        <View className="gap-2">
          <Text className="text-xl font-semibold text-foreground">{snapshot.periodTitle}</Text>
          <Text className="text-sm leading-5 text-muted">Gợi ý được lọc theo chế độ ăn và dị ứng đã khai báo.</Text>
        </View>

        {snapshot.recommendations.length ? (
          <FlatList
            contentContainerStyle={{ paddingRight: 20 }}
            data={snapshot.recommendations}
            horizontal
            keyExtractor={(item) => item.id}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <RecommendationCard
                item={item}
                onBookmark={() => runAction(`save:${item.id}`, () => (item.isSaved ? unsave.mutateAsync({ recommendationId: item.id }) : save.mutateAsync({ now: new Date(), recommendationId: item.id })))}
                onLog={() => runAction(`meal:${item.id}`, () => logMeal.mutateAsync({ now: new Date(), recommendationId: item.id }))}
                pending={pendingId === `save:${item.id}` || pendingId === `meal:${item.id}`}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View className="gap-3 rounded-[20px] bg-card p-5" style={styles.cardShadow}>
            <Text className="text-base font-semibold text-foreground">Chưa có gợi ý phù hợp</Text>
            <Text className="text-sm leading-5 text-muted">Hãy trò chuyện với Nutelyt để nhận một gợi ý tổng quát cho mục tiêu giảm cân.</Text>
          </View>
        )}

        {actionError ? <Text accessibilityLiveRegion="polite" className="text-sm text-[#C02828]">{actionError}</Text> : null}

        {snapshot.activitySuggestion ? (
          <View className="flex-row items-center gap-4 rounded-[20px] border border-primary-100 bg-card p-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-50"><Feather color={colors.primaryDark} name="activity" size={21} /></View>
            <View className="flex-1 gap-1"><Text className="text-base font-semibold text-foreground">{snapshot.activitySuggestion.name}</Text><Text className="text-sm text-muted">Khoảng {snapshot.activitySuggestion.caloriesEstimate} kcal</Text></View>
            <Pressable
              accessibilityLabel={`Ghi nhận đã tập ${snapshot.activitySuggestion.name}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: snapshot.activitySuggestion.isLogged || pendingId === `activity:${snapshot.activitySuggestion.id}` }}
              className="min-h-11 rounded-xl bg-primary-600 px-3"
              disabled={snapshot.activitySuggestion.isLogged || pendingId === `activity:${snapshot.activitySuggestion.id}`}
              onPress={() => runAction(
                `activity:${snapshot.activitySuggestion?.id}`,
                () => logActivity.mutateAsync({ ...snapshot.activitySuggestion!, now: new Date() })
              )}
            >
              <Text className="pt-3 text-xs font-semibold text-white">{snapshot.activitySuggestion.isLogged ? 'Đã tập' : 'Ghi nhận'}</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable accessibilityLabel="Trò chuyện với Nutelyt" accessibilityRole="button" className="overflow-hidden rounded-[24px] bg-primary-600 p-5" onPress={() => router.navigate(routes.chatAi)} style={styles.companionShadow}>
          <View className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <View className="flex-row items-center gap-4"><View className="h-12 w-12 items-center justify-center rounded-full bg-white/15"><Feather color="#FFFFFF" name="message-circle" size={23} /></View><View className="flex-1 gap-1"><Text className="text-lg font-semibold text-white">{snapshot.companionPrompt.title}</Text><Text className="text-sm leading-5 text-white/85">{snapshot.companionPrompt.body}</Text></View><Feather color="#FFFFFF" name="arrow-right" size={20} /></View>
        </Pressable>

        <Pressable accessibilityLabel="Xem tiến trình 7 ngày" accessibilityRole="button" className="min-h-16 flex-row items-center justify-between rounded-[20px] bg-card px-5" onPress={() => router.navigate(routes.dashboard)} style={styles.cardShadow}>
          <View className="flex-row items-center gap-3"><View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50"><Feather color={colors.primaryDark} name="bar-chart-2" size={19} /></View><View><Text className="text-base font-semibold text-foreground">Xem tiến trình 7 ngày</Text><Text className="text-sm text-muted">Theo dõi thói quen từng ngày</Text></View></View><Feather color={colors.primaryDark} name="chevron-right" size={21} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: { boxShadow: '0 5px 16px rgba(23, 46, 28, 0.07)' },
  companionShadow: { boxShadow: '0 12px 26px rgba(39, 174, 96, 0.22)' },
  progressShadow: { boxShadow: '0 12px 24px rgba(0, 109, 55, 0.19)' },
  tabular: { fontVariant: ['tabular-nums'] },
});
