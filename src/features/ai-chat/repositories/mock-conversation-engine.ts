import { homeRuntimeLogSource } from '@/features/home';

import type { ChatMessageContent, ChatProfileContext } from '@/features/ai-chat/ai-chat.types';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLocaleLowerCase('vi-VN').trim();
}

function personalizedRecipe(recommendationId: string, profile: ChatProfileContext, now: Date) {
  const recommendation = homeRuntimeLogSource.getRecommendationForProfile(recommendationId, profile, now)
    ?? homeRuntimeLogSource.getFallbackRecommendation(profile, now);
  if (!recommendation) return null;
  return {
    calories: recommendation.nutrition.calories,
    description: recommendation.description,
    image: recommendation.image,
    kind: 'recipe-recommendation' as const,
    personalizationNote: profile.diet
      ? `Gợi ý đã tránh các lựa chọn không phù hợp rõ ràng với chế độ ${profile.diet} và dị ứng đã khai báo.`
      : 'Gợi ý ưu tiên khẩu phần vừa phải cho mục tiêu giảm cân của bạn.',
    proteinGrams: recommendation.nutrition.proteinGrams,
    recommendationId: recommendation.id,
    tags: recommendation.tags,
    title: recommendation.name,
    warning: 'Gợi ý này chỉ mang tính tham khảo, không thay thế tư vấn y tế hoặc dinh dưỡng chuyên môn.',
  };
}

export function createMockResponse(input: { now: Date; profile: ChatProfileContext; text: string }): ChatMessageContent[] {
  const request = normalize(input.text);
  if (request.includes('mo phong loi') || request.includes('test loi') || request.includes('fail chat')) {
    throw new Error('Mock conversation request failed.');
  }

  if (request.includes('pho ga') || request.includes('vua an pho')) {
    const analysisRecipe = homeRuntimeLogSource.getRecommendationForProfile('pho-ga-light', input.profile, input.now)
      ?? homeRuntimeLogSource.getFallbackRecommendation(input.profile, input.now);
    if (!analysisRecipe) return [{ kind: 'text', text: 'Mình chưa có dữ liệu món phù hợp với hồ sơ hiện tại. Bạn có thể hỏi một lựa chọn nhẹ hơn.' }];
    const conflictsDiet = input.profile.diet === 'vegetarian' || input.profile.diet === 'vegan';
    return [
      { kind: 'text', text: 'Mình đã ghi nhận mô tả của bạn. Dưới đây là phân tích tham khảo cho một phần phở gà vừa.' },
      {
        calories: analysisRecipe.nutrition.calories,
        cautions: conflictsDiet
          ? ['Phở gà không phù hợp với chế độ ăn hiện tại của bạn.', 'Nên lưu ý khẩu phần bún và nước dùng nhiều natri.']
          : ['Nên ưu tiên phần vừa, bỏ da gà và hạn chế dùng hết nước dùng.', 'Điều chỉnh các bữa còn lại trong ngày thay vì bỏ bữa.'],
        image: analysisRecipe.image,
        kind: 'food-analysis',
        portion: '1 tô phần vừa',
        proteinGrams: analysisRecipe.nutrition.proteinGrams,
        recommendationId: 'pho-ga-light',
        strengths: ['Có protein từ thịt gà.', 'Có thể thêm rau thơm để tăng chất xơ.'],
        suitability: conflictsDiet ? 'less-suitable' : 'suitable-with-notes',
        title: 'Phở gà phần vừa',
      },
    ];
  }

  if (request.includes('tap nhe') || request.includes('5 phut') || request.includes('khoi dong')) {
    return [
      { kind: 'text', text: 'Một hoạt động nhẹ có thể giúp bạn vận động đều đặn, không phải để bù cho bữa ăn.' },
      { caloriesEstimate: 25, durationMinutes: 5, id: 'chat-light-stretch', instructions: 'Đi bộ tại chỗ 2 phút, xoay vai nhẹ 1 phút, giãn cơ chân và hít thở chậm 2 phút.', intensity: 'light', kind: 'activity-suggestion', title: 'Vận động nhẹ 5 phút' },
    ];
  }

  if (request.includes('bun bo')) {
    const recipe = personalizedRecipe('bun-bo-light', input.profile, input.now);
    return recipe
      ? [{ kind: 'text', text: `Mình gợi ý một phiên bản bún bò nhẹ hơn cho mục tiêu giảm cân của ${input.profile.displayName}.` }, recipe]
      : [{ kind: 'text', text: 'Mình chưa có lựa chọn bún bò phù hợp rõ ràng với hồ sơ hiện tại.' }];
  }

  if (request.includes('goi y') || request.includes('bua sang') || request.includes('bua trua') || request.includes('bua toi') || request.includes('bua nhe')) {
    const recipe = personalizedRecipe('vegetable-soup', input.profile, input.now);
    return recipe
      ? [{ kind: 'text', text: 'Đây là một lựa chọn đơn giản, ưu tiên khẩu phần vừa phải và phù hợp với ngữ cảnh hiện tại.' }, recipe]
      : [{ kind: 'text', text: 'Mình chưa có gợi ý phù hợp rõ ràng với hồ sơ hiện tại.' }];
  }

  return [{ kind: 'text', text: 'Mình có thể hỗ trợ gợi ý bữa ăn, phân tích món vừa dùng hoặc một hoạt động nhẹ. Bạn có thể thử hỏi “Gợi ý bữa sáng nhanh” hoặc “Tôi vừa ăn phở gà”.' }];
}
