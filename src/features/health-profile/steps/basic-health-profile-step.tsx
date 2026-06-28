import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { HealthField } from '../components/health-field';
import { HealthInfoCard } from '../components/health-info-card';
import { HealthSectionHeader } from '../components/health-profile-header';
import type { Gender } from '../types';

const shadow = { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' };

export function BasicHealthProfileStep({
  age,
  fullName,
  gender,
  height,
  setAge,
  setFullName,
  setGender,
  setHeight,
  setWeight,
  weight,
}: {
  age: string;
  fullName: string;
  gender: Gender;
  height: string;
  setAge: (value: string) => void;
  setFullName: (value: string) => void;
  setGender: (value: Gender) => void;
  setHeight: (value: string) => void;
  setWeight: (value: string) => void;
  weight: string;
}) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Để đưa ra phân tích dinh dưỡng phù hợp với bạn, AI cần biết một số thông tin cơ bản về tình trạng thể chất của bạn."
        title="Hồ sơ sức khỏe"
      />
      <View className="gap-4 rounded-[12px] bg-card p-6" style={shadow}>
        <HealthInfoCard compact>
          Thông tin tới AI: Những dữ liệu này giúp chúng tôi tính toán chính xác hơn nhu cầu
          calo hằng ngày và khả năng hấp thụ dưỡng chất của bạn.
        </HealthInfoCard>
        <HealthField
          autoCapitalize="words"
          label="Họ và tên"
          onChangeText={setFullName}
          placeholder="e.g. Nguyễn An"
          suffix=""
          value={fullName}
        />
        <HealthField
          keyboardType="number-pad"
          label="Tuổi"
          onChangeText={setAge}
          placeholder="e.g. 45"
          suffix="Năm"
          value={age}
        />
        <View className="gap-2">
          <Text className="px-1 text-sm text-muted">Giới tính</Text>
          <View className="h-14 flex-row rounded-[12px] bg-[#EEF2EE] p-1">
            {(['Nam', 'Nữ', 'Khác'] as Gender[]).map((item) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: gender === item }}
                className={`flex-1 items-center justify-center rounded-[10px] ${
                  gender === item ? 'bg-card' : ''
                }`}
                key={item}
                onPress={() => setGender(item)}
                style={gender === item ? shadow : undefined}
              >
                <Text
                  className={`text-sm ${gender === item ? 'text-primary-700' : 'text-muted'}`}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View className="flex-row gap-4">
          <HealthField
            className="flex-1"
            keyboardType="number-pad"
            label="Chiều cao"
            onChangeText={setHeight}
            placeholder="175"
            suffix="cm"
            value={height}
          />
          <HealthField
            className="flex-1"
            keyboardType="number-pad"
            label="Cân nặng"
            onChangeText={setWeight}
            placeholder="72"
            suffix="kg"
            value={weight}
          />
        </View>
        <View className="flex-row gap-2">
          <Feather color="#6D7A6E" name="lock" size={14} />
          <Text className="flex-1 text-xs leading-[18px] text-[#6D7A6E]">
            Dữ liệu của bạn được mã hóa và chỉ được sử dụng cho mục đích phân tích.
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        className="min-h-20 justify-center rounded-[12px] bg-card px-6"
        style={shadow}
      >
        <Text className="text-lg text-foreground">+ Thêm thành viên</Text>
      </Pressable>
    </View>
  );
}