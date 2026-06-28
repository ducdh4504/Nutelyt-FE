import type { Dispatch, SetStateAction } from 'react';
import { LayoutAnimation, View } from 'react-native';

import { HealthOptionCard } from '../components/health-option-card';
import { HealthSectionHeader } from '../components/health-profile-header';
import { conditions } from '../data/health-profile-options';

export function MedicalConditionsStep({
  selectedConditions,
  setSelectedConditions,
}: {
  selectedConditions: string[];
  setSelectedConditions: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Vui lòng chọn các tình trạng bệnh lý liên quan. Thông tin này giúp chúng tôi điều chỉnh phân tích và tư vấn dinh dưỡng theo nhu cầu sức khỏe của bạn."
        title="Tình trạng bệnh lý"
      />
      <View className="gap-4">
        {conditions.map((item, index) => (
          <HealthOptionCard
            compact
            index={index}
            isSelected={selectedConditions.includes(item.id)}
            key={item.id}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setSelectedConditions((current) =>
                current.includes(item.id)
                  ? current.filter((id) => id !== item.id)
                  : [...current, item.id]
              );
            }}
            option={item}
          />
        ))}
      </View>
    </View>
  );
}