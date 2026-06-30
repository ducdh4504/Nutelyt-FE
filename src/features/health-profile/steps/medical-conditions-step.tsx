import type { Dispatch, SetStateAction } from 'react';
import { LayoutAnimation, Text, TextInput, View } from 'react-native';

import { HealthOptionCard } from '../components/health-option-card';
import { HealthSectionHeader } from '../components/health-profile-header';
import { conditions } from '../data/health-profile-options';

const shadow = { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' };

export function MedicalConditionsStep({
  allergyText,
  selectedConditions,
  setAllergyText,
  setSelectedConditions,
}: {
  allergyText: string;
  selectedConditions: string[];
  setAllergyText: (value: string) => void;
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
      <View className="gap-3 rounded-[12px] bg-card p-5" style={shadow}>
        <View className="gap-1">
          <Text className="text-xl font-semibold leading-7 text-foreground">
            Thực phẩm dị ứng nếu có
          </Text>
          <Text className="text-sm leading-5 text-muted">
            Nhập các thực phẩm bạn cần tránh để Nutelyt cá nhân hóa gợi ý món ăn phù hợp hơn.
          </Text>
        </View>
        <View className="min-h-24 rounded-[8px] border-2 border-[#BCCABC] bg-card px-4 py-3">
          <TextInput
            className="min-h-20 text-base leading-6 text-foreground"
            multiline
            onChangeText={setAllergyText}
            placeholder="Ví dụ: hải sản, đậu phộng, sữa..."
            placeholderTextColor="#6B7280"
            textAlignVertical="top"
            value={allergyText}
          />
        </View>
      </View>
    </View>
  );
}