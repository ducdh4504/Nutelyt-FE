import type { RouteProfileParams } from '@/types/navigation.types';
import { parsePositiveNumber } from '@/utils/numbers';
import { getFirstRouteParam } from '@/utils/route-params';
import { safeStringArray, safeText } from '@/utils/safe-values';

import type { HealthProfileSummary } from '../health-profile.types';

export function getProfileFallback(): HealthProfileSummary {
  return {
    allergyText: '',
    conditionLabels: [],
    conditions: [],
    dateOfBirth: '',
    fullName: 'Người dùng Nutelyt',
    age: '--',
    gender: '--',
    height: '--',
    weight: '--',
    purpose: '',
    diseases: [],
    goal: null,
    goalLabel: 'Chưa chọn',
    diet: null,
    dietLabel: 'Chưa chọn',
  };
}

function safeNullableText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function calculateAgeFromBirthDate(value: string, fallback = '--') {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return fallback;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) {
    age -= 1;
  }

  return age > 0 ? `${age} tuổi` : fallback;
}

export function parseHealthProfileParam(params: RouteProfileParams): HealthProfileSummary {
  const profileParam = getFirstRouteParam(params.profile);

  if (!profileParam) {
    return getProfileFallback();
  }

  try {
    const parsed = JSON.parse(profileParam) as Partial<HealthProfileSummary>;
    const fallback = getProfileFallback();
    const dateOfBirth = safeText(parsed.dateOfBirth, '');
    const conditionLabels = safeStringArray(parsed.conditionLabels);
    const diseases = safeStringArray(parsed.diseases);
    const conditions = safeStringArray(parsed.conditions);
    const goal = safeNullableText(parsed.goal);
    const diet = safeNullableText(parsed.diet);

    return {
      allergyText: safeText(parsed.allergyText, ''),
      conditionLabels: conditionLabels.length ? conditionLabels : diseases,
      conditions: conditions.length ? conditions : diseases,
      dateOfBirth,
      fullName: safeText(parsed.fullName, fallback.fullName),
      age: safeText(parsed.age, dateOfBirth ? calculateAgeFromBirthDate(dateOfBirth) : fallback.age),
      gender: safeText(parsed.gender),
      height: safeText(parsed.height),
      weight: safeText(parsed.weight),
      purpose: Array.isArray(parsed.purpose)
        ? parsed.purpose.filter((item): item is string => typeof item === 'string')
        : safeText(parsed.purpose, ''),
      diseases: diseases.length ? diseases : conditionLabels,
      goal,
      goalLabel: safeText(parsed.goalLabel, goal ?? fallback.goalLabel),
      diet,
      dietLabel: safeText(parsed.dietLabel, diet ?? fallback.dietLabel),
    };
  } catch {
    return getProfileFallback();
  }
}

export function serializeProfile(profile: HealthProfileSummary) {
  return JSON.stringify(profile);
}

export function calculateBMI(heightCm: string, weightKg: string) {
  const height = parsePositiveNumber(heightCm);
  const weight = parsePositiveNumber(weightKg);

  if (!height || !weight) {
    return null;
  }

  return weight / Math.pow(height / 100, 2);
}

export function normalizeToken(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function profileHas(profile: HealthProfileSummary, ids: string[], words: string[]) {
  return profile.diseases.some((value) => {
    const normalized = normalizeToken(value);
    return ids.includes(value) || words.some((word) => normalized.includes(word));
  });
}
