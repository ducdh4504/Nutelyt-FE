import { View } from 'react-native';

import { HealthOptionCard } from '../components/health-option-card';
import { HealthSectionHeader } from '../components/health-profile-header';
import { diets } from '../data/health-profile-options';

export function DietPreferenceStep({
  diet,
  noDiet,
  setDiet,
}: {
  diet: string;
  noDiet: boolean;
  setDiet: (id: string) => void;
}) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        subtitle="Vui lòng chọn chế độ ăn phù hợp nhất với lối sống của bạn. Thông tin này giúp chúng tôi cá nhân hóa kết quả phân tích và khuyến nghị dinh dưỡng."
        title="Chế độ ăn của bạn là gì?"
      />
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {diets.map((item, index) => (
          <HealthOptionCard
            bento={index < 4}
            wide={index === 4}
            index={index}
            isSelected={!noDiet && diet === item.id}
            key={item.id}
            onPress={() => setDiet(item.id)}
            option={item}
          />
        ))}
      </View>
    </View>
  );
}