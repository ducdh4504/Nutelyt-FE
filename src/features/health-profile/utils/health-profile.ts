import type { RouteProfileParams } from '@/types/navigation.types';
import { parsePositiveNumber } from '@/utils/numbers';
import { getFirstRouteParam } from '@/utils/route-params';
import { safeStringArray, safeText } from '@/utils/safe-values';

import { getDietLabel, getGoalSpeedLabel } from '../config/health-profile-options';
import type { HealthProfilePresentation, HealthProfileSummary, HealthProfileValues } from '../health-profile.types';

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

export function getBMICategory(bmi: number | null) {
  if (bmi === null) return 'Chưa có dữ liệu';
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 25) return 'Bình thường';
  if (bmi < 30) return 'Thừa cân';
  return 'Béo phì';
}

export function getHealthProfilePresentation(values: HealthProfileValues): HealthProfilePresentation {
  const bmiValue = calculateBMI(values.height, values.currentWeight);
  return {
    allergiesLabel: values.allergies.length ? values.allergies.join(', ') : 'Không có',
    bmiCategory: getBMICategory(bmiValue),
    bmiValue,
    dietLabel: getDietLabel(values.diet),
    goalSpeedLabel: getGoalSpeedLabel(values.goalSpeed),
  };
}

export function toHealthProfileSummary(values: HealthProfileValues): HealthProfileSummary {
  const presentation = getHealthProfilePresentation(values);
  return {
    age: calculateAgeFromBirthDate(values.birthday),
    allergies: values.allergies,
    allergyText: values.allergies.join(', '),
    birthday: values.birthday,
    conditionLabels: [],
    conditions: [],
    currentWeight: values.currentWeight.trim(),
    dateOfBirth: values.birthday,
    diet: values.diet,
    dietLabel: presentation.dietLabel,
    diseases: [],
    fullName: values.fullName.trim(),
    gender: values.gender ?? '--',
    goal: 'weight-loss',
    goalLabel: 'Giảm cân',
    goalSpeed: values.goalSpeed ?? undefined,
    height: values.height.trim(),
    purpose: 'weight-loss',
    targetWeight: values.targetWeight.trim(),
    weight: values.currentWeight.trim(),
  };
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
