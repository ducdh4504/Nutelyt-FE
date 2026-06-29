import type { HealthProfileSummary, RouteProfileParams } from '../types';

export function getProfileFallback(): HealthProfileSummary {
  return {
    fullName: 'Người dùng Nutelyt',
    age: '--',
    gender: '--',
    height: '--',
    weight: '--',
    purpose: '',
    diseases: [],
    goal: null,
    diet: null,
  };
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function safeText(value: unknown, fallback = '--') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function parseHealthProfileParam(params: RouteProfileParams): HealthProfileSummary {
  const profileParam = firstParam(params.profile);

  if (!profileParam) {
    return getProfileFallback();
  }

  try {
    const parsed = JSON.parse(profileParam) as Partial<HealthProfileSummary>;

    return {
      fullName: safeText(parsed.fullName, getProfileFallback().fullName),
      age: safeText(parsed.age),
      gender: safeText(parsed.gender),
      height: safeText(parsed.height),
      weight: safeText(parsed.weight),
      purpose: Array.isArray(parsed.purpose)
        ? parsed.purpose.filter((item): item is string => typeof item === 'string')
        : safeText(parsed.purpose, ''),
      diseases: Array.isArray(parsed.diseases)
        ? parsed.diseases.filter((item): item is string => typeof item === 'string')
        : [],
      goal: typeof parsed.goal === 'string' && parsed.goal.trim() ? parsed.goal.trim() : null,
      diet: typeof parsed.diet === 'string' && parsed.diet.trim() ? parsed.diet.trim() : null,
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
