import type { FoodStatus, HealthProfileSummary, MockFood } from '../types';
import { normalizeToken, profileHas } from './health-profile';

export function getFoodStatusForProfile(profile: HealthProfileSummary, food: MockFood): FoodStatus {
  if (
    food.nutrition.sodium >= 900 &&
    profileHas(profile, ['pressure', 'hypertension'], ['tang huyet ap'])
  ) {
    return 'avoid';
  }

  if (
    food.nutrition.sodium >= 450 ||
    (food.nutrition.carbs >= 45 &&
      profileHas(profile, ['diabetes'], ['tieu duong', 'diabetes'])) ||
    (food.nutrition.fat >= 15 &&
      profileHas(profile, ['fat', 'dyslipidemia'], ['roi loan mo mau', 'mo mau']))
  ) {
    return 'warning';
  }

  return food.status;
}

export function getStatusLabel(status: FoodStatus) {
  if (status === 'safe') {
    return 'Phù hợp';
  }
  if (status === 'avoid') {
    return 'Không phù hợp';
  }
  return 'Cần lưu ý';
}

export function getAnalysisWarnings(profile: HealthProfileSummary, food: MockFood) {
  const warnings: { title: string; body: string; tone: 'danger' | 'success' | 'warning' }[] = [];

  if (profileHas(profile, ['pressure', 'hypertension'], ['tang huyet ap'])) {
    warnings.push({
      title: 'Có thể cần lưu ý natri',
      body: `${food.name} có khoảng ${food.nutrition.sodium}mg natri mỗi khẩu phần. Nên cân nhắc giảm nước dùng hoặc chọn khẩu phần nhỏ hơn nếu bạn đang theo dõi huyết áp.`,
      tone: food.nutrition.sodium >= 450 ? 'danger' : 'warning',
    });
  }

  if (profileHas(profile, ['diabetes'], ['tieu duong', 'diabetes'])) {
    warnings.push({
      title: 'Cân nhắc lượng tinh bột',
      body: `Món này có khoảng ${food.nutrition.carbs}g carb mỗi khẩu phần. Thông tin chỉ mang tính tham khảo và nên được cân đối với bữa ăn trong ngày.`,
      tone: food.nutrition.carbs >= 45 ? 'warning' : 'success',
    });
  }

  if (profileHas(profile, ['fat', 'dyslipidemia'], ['roi loan mo mau', 'mo mau'])) {
    warnings.push({
      title: 'Cân nhắc chất béo',
      body: `Món này có khoảng ${food.nutrition.fat}g chất béo. Bạn có thể ưu tiên cách chế biến ít dầu hơn khi cần kiểm soát mỡ máu.`,
      tone: food.nutrition.fat >= 15 ? 'warning' : 'success',
    });
  }

  const goal = normalizeToken(profile.goal ?? '');
  if (profile.goal === 'loss' || goal.includes('giam can')) {
    warnings.push({
      title: 'Nên cân nhắc khẩu phần',
      body: `Khoảng ${food.nutrition.calories} kcal mỗi khẩu phần. Có thể điều chỉnh lượng ăn để phù hợp với mục tiêu giảm cân.`,
      tone: food.nutrition.calories >= 350 ? 'warning' : 'success',
    });
  }

  if (profile.goal === 'muscle' || goal.includes('tang co')) {
    warnings.push({
      title: 'Cân bằng protein',
      body: `Món này cung cấp khoảng ${food.nutrition.protein}g protein. Có thể kết hợp thêm nguồn đạm nạc nếu bữa ăn chưa đủ nhu cầu.`,
      tone: 'success',
    });
  }

  if (!warnings.length) {
    warnings.push({
      title: 'Phù hợp ở mức tham khảo',
      body: 'Dựa trên hồ sơ hiện tại, món này có thể dùng với khẩu phần hợp lý. Thông tin chỉ mang tính tham khảo.',
      tone: 'success',
    });
  }

  return warnings.slice(0, 3);
}

export function getAIAnalysisCopy(profile: HealthProfileSummary, food: MockFood) {
  const hasProfile = profile.fullName !== 'Người dùng Nutelyt';
  return hasProfile
    ? `Dựa trên hồ sơ sức khỏe hiện tại của bạn, ${food.name} được đánh giá bằng dữ liệu mẫu cục bộ. Nutelyt gợi ý bạn cân nhắc khẩu phần, lượng natri và cân bằng dinh dưỡng trong ngày.`
    : `Đây là phân tích mẫu cục bộ cho ${food.name}. Khi hồ sơ sức khỏe được cập nhật đầy đủ, các cảnh báo sẽ được cá nhân hóa hơn.`;
}
