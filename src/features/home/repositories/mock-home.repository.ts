import { homeRecommendationSeed } from '@/features/home/data/mock-home';
import { getLocalDateKey, getMealPeriodCopy, resolveMealPeriod } from '@/features/home/meal-period';
import { homeSnapshotSchema } from '@/features/home/schemas/home.schema';
import type { ActivityLog, HomeProfileContext, HomeRuntimeHistoryEvent, HomeSnapshot, MealLog, MealRecommendation } from '@/features/home/home.types';

const savedRecommendations = new Map<string, { savedAt: string }>();
const mealLogs = new Map<string, MealLog>();
const activityLogs = new Map<string, ActivityLog>();

function normalizeToken(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLocaleLowerCase('vi-VN');
}

function compatibleWithProfile(item: Omit<MealRecommendation, 'isLogged' | 'isSaved'>, profile: HomeProfileContext) {
  const supportsDiet = !profile.diet || item.supportedDiets.includes(profile.diet);
  const hasAllergen = item.allergens.some((allergen) => profile.allergies.some((allergy) => normalizeToken(allergy).includes(normalizeToken(allergen))));
  return supportsDiet && !hasAllergen;
}

function toRecommendation(item: Omit<MealRecommendation, 'isLogged' | 'isSaved'>, localDate: string): MealRecommendation {
  return {
    ...item,
    isLogged: mealLogs.has(`${localDate}:${item.id}`),
    isSaved: savedRecommendations.has(item.id),
  };
}

function getCandidateRecommendations(profile: HomeProfileContext, localDate: string, now: Date) {
  const period = resolveMealPeriod(now);
  const compatible = homeRecommendationSeed.filter((item) => compatibleWithProfile(item, profile));
  const periodMatches = compatible.filter((item) => item.periods.includes(period));
  const source = periodMatches.length ? periodMatches : compatible;
  return source.map((item) => toRecommendation(item, localDate));
}

function getProgress(localDate: string) {
  const todayMeals = [...mealLogs.values()].filter((log) => log.stableId.startsWith(`${localDate}:`));
  const todayActivities = [...activityLogs.values()].filter((log) => log.stableId.startsWith(`${localDate}:`));
  return {
    activityMinutes: todayActivities.reduce((total, log) => total + log.durationMinutes, 0),
    mealGoal: 3,
    mealsLogged: todayMeals.length,
  };
}

function getCompanionPrompt(period: ReturnType<typeof resolveMealPeriod>) {
  if (period === 'outside-meal-window') {
    return {
      body: 'Hiện đang ngoài khung bữa ăn thường lệ. Bạn đang đói, muốn chọn một món nhẹ hay vận động thư giãn một chút?',
      title: 'Nutelyt luôn ở đây cùng bạn',
    };
  }
  return { body: 'Chọn món phù hợp hoặc hỏi Nutelyt để được gợi ý theo mục tiêu giảm cân của bạn.', title: 'Bạn chưa biết ăn gì?' };
}

export const homeMockRepository = {
  getSnapshot(profile: HomeProfileContext, now: Date): HomeSnapshot {
    const mealPeriod = resolveMealPeriod(now);
    const localDate = getLocalDateKey(now);
    const periodCopy = getMealPeriodCopy(mealPeriod);
    const snapshot = {
      activitySuggestion: mealPeriod === 'outside-meal-window'
        ? {
          caloriesEstimate: 65,
          durationMinutes: 15,
          id: 'gentle-walk',
          isLogged: activityLogs.has(`${localDate}:gentle-walk`),
          name: 'Đi bộ nhẹ 15 phút',
        }
        : null,
      companionPrompt: getCompanionPrompt(mealPeriod),
      dailyProgress: getProgress(localDate),
      generatedAt: now.toISOString(),
      greeting: periodCopy.greeting,
      localDate,
      mealPeriod,
      periodTitle: periodCopy.title,
      recommendations: getCandidateRecommendations(profile, localDate, now),
    } satisfies HomeSnapshot;
    return homeSnapshotSchema.parse(snapshot);
  },

  logActivity(activity: { caloriesEstimate: number; durationMinutes: number; id: string; name?: string }, now: Date) {
    const localDate = getLocalDateKey(now);
    const stableId = `${localDate}:${activity.id}`;
    if (activityLogs.has(stableId)) throw new Error('Activity already logged today.');
    activityLogs.set(stableId, { activityId: activity.id, caloriesEstimate: activity.caloriesEstimate, completedAt: now.toISOString(), durationMinutes: activity.durationMinutes, name: activity.name, stableId });
  },

  logMeal(recommendationId: string, now: Date) {
    const recommendation = homeRecommendationSeed.find((item) => item.id === recommendationId);
    if (!recommendation) throw new Error('Recommendation not found.');
    const localDate = getLocalDateKey(now);
    const stableId = `${localDate}:${recommendationId}`;
    if (mealLogs.has(stableId)) throw new Error('Meal already logged today.');
    mealLogs.set(stableId, { consumedAt: now.toISOString(), nutrition: recommendation.nutrition, recommendationId, stableId });
  },

  saveRecommendation(recommendationId: string, now: Date) {
    if (!homeRecommendationSeed.some((item) => item.id === recommendationId)) throw new Error('Recommendation not found.');
    savedRecommendations.set(recommendationId, { savedAt: now.toISOString() });
  },

  unsaveRecommendation(recommendationId: string) {
    savedRecommendations.delete(recommendationId);
  },

  getRecommendationForProfile(recommendationId: string, profile: HomeProfileContext, now: Date) {
    const recommendation = homeRecommendationSeed.find((item) => item.id === recommendationId);
    if (!recommendation || !compatibleWithProfile(recommendation, profile)) return null;
    return toRecommendation(recommendation, getLocalDateKey(now));
  },

  getFallbackRecommendation(profile: HomeProfileContext, now: Date) {
    const localDate = getLocalDateKey(now);
    const compatible = homeRecommendationSeed.filter((item) => compatibleWithProfile(item, profile));
    const matchingPeriod = compatible.filter((item) => item.periods.includes(resolveMealPeriod(now)));
    return (matchingPeriod[0] ?? compatible[0]) ? toRecommendation(matchingPeriod[0] ?? compatible[0], localDate) : null;
  },

  getRuntimeHistoryEvents(): HomeRuntimeHistoryEvent[] {
    const meals = [...mealLogs.values()].flatMap((log) => {
      const recommendation = homeRecommendationSeed.find((item) => item.id === log.recommendationId);
      return recommendation
        ? [{
            calories: log.nutrition.calories,
            id: `meal:${log.stableId}`,
            image: recommendation.image,
            kind: 'meal' as const,
            occurredAt: log.consumedAt,
            proteinGrams: log.nutrition.proteinGrams,
            title: recommendation.name,
          }]
        : [];
    });
    const activities = [...activityLogs.values()].map((log) => ({
      caloriesEstimate: log.caloriesEstimate,
      durationMinutes: log.durationMinutes,
      id: `activity:${log.stableId}`,
      kind: 'activity' as const,
      occurredAt: log.completedAt,
      title: log.name ?? (log.activityId === 'gentle-walk' ? 'Đi bộ nhẹ 15 phút' : 'Hoạt động đã hoàn thành'),
    }));
    const saved = [...savedRecommendations.entries()].flatMap(([recommendationId, savedRecord]) => {
      const recommendation = homeRecommendationSeed.find((item) => item.id === recommendationId);
      return recommendation
        ? [{
            id: `saved:${recommendationId}`,
            image: recommendation.image,
            kind: 'saved' as const,
            occurredAt: savedRecord.savedAt,
            title: recommendation.name,
          }]
        : [];
    });
    return [...meals, ...activities, ...saved].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));
  },
} as const;
