import type { HealthProfileSummary, RouteProfileParams } from '@/src/features/profile/profile.types';

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

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function safeText(value: unknown, fallback = '--') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function safeNullableText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function calculateAgeFromBirthDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return '--';
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) {
    age -= 1;
  }

  return age > 0 ? `${age} tuổi` : '--';
}

export function parseHealthProfileParam(params: RouteProfileParams): HealthProfileSummary {
  const profileParam = firstParam(params.profile);

  if (!profileParam) {
    return getProfileFallback();
  }

  try {
    const parsed = JSON.parse(profileParam) as Partial<HealthProfileSummary>;
    const fallback = getProfileFallback();
    const dateOfBirth = safeText(parsed.dateOfBirth, '');
    const conditionLabels = safeArray(parsed.conditionLabels);
    const diseases = safeArray(parsed.diseases);
    const conditions = safeArray(parsed.conditions);
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

function parseNumeric(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function calculateBMI(heightCm: string, weightKg: string) {
  const height = parseNumeric(heightCm);
  const weight = parseNumeric(weightKg);

  if (!height || !weight) {
    return null;
  }

  return weight / Math.pow(height / 100, 2);
}

export function getFirstName(fullName: string) {
  const fallback = 'bạn';
  if (!fullName || fullName === getProfileFallback().fullName) {
    return fallback;
  }

  return fullName.trim().split(/\s+/).at(-1) ?? fallback;
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

export function getProfileDietChips(profile: HealthProfileSummary) {
  const chips: string[] = [];
  const add = (label: string) => {
    if (!chips.includes(label)) {
      chips.push(label);
    }
  };

  if (profile.diet) {
    const diet = normalizeToken(profile.diet);
    if (diet.includes('keto')) {
      add('Keto');
    } else if (diet.includes('vegan') || diet.includes('chay')) {
      add('Ăn chay');
    } else if (diet.includes('low-carb') || diet.includes('giam tinh bot')) {
      add('Ít tinh bột');
    } else {
      add(profile.diet);
    }
  }

  if (profile.goal) {
    const goal = normalizeToken(profile.goal);
    if (profile.goal === 'loss' || goal.includes('giam can')) {
      add('Giảm cân');
    } else if (profile.goal === 'muscle' || goal.includes('tang co')) {
      add('Tăng cơ');
    } else if (profile.goal === 'maintain' || goal.includes('duy tri')) {
      add('Duy trì sức khỏe');
    } else {
      add(profile.goal);
    }
  }

  if (profileHas(profile, ['pressure', 'hypertension'], ['tang huyet ap'])) {
    add('Hạn chế muối');
  }

  return chips.length ? chips.slice(0, 3) : ['Hồ sơ đang cập nhật'];
}

export function getProfileScore(profile: HealthProfileSummary) {
  const bmi = calculateBMI(profile.height, profile.weight);
  if (!bmi) {
    return 85;
  }

  if (bmi >= 18.5 && bmi < 23) {
    return 92;
  }

  if (bmi < 18.5 || bmi >= 25) {
    return 78;
  }

  return 84;
}
