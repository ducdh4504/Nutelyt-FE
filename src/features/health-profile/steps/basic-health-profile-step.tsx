import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { HealthField } from '../components/health-field';
import { HealthInfoCard } from '../components/health-info-card';
import { HealthSectionHeader } from '../components/health-profile-header';
import type { Gender } from '../types';

const shadow = { boxShadow: '0 16px 16px rgba(0, 0, 0, 0.06)' };
const years = Array.from({ length: 86 }, (_, index) => String(new Date().getFullYear() - 10 - index));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));

function formatDateOfBirth(value: string) {
  if (!value) {
    return 'Chọn ngày sinh';
  }
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function PickerColumn({
  label,
  onSelect,
  options,
  value,
}: {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <View className="flex-1 gap-2">
      <Text className="text-center text-sm font-semibold text-muted">{label}</Text>
      <ScrollView className="max-h-56 rounded-[10px] bg-[#F3F3F6]" showsVerticalScrollIndicator={false}>
        {options.map((item) => (
          <Pressable
            accessibilityRole="button"
            className={`h-11 items-center justify-center rounded-[10px] ${
              value === item ? 'bg-primary-600' : ''
            }`}
            key={item}
            onPress={() => onSelect(item)}
          >
            <Text className={`text-base ${value === item ? 'font-semibold text-white' : 'text-foreground'}`}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function BasicHealthProfileStep({
  dateOfBirth,
  fullName,
  gender,
  height,
  setDateOfBirth,
  setFullName,
  setGender,
  setHeight,
  setWeight,
  weight,
}: {
  dateOfBirth: string;
  fullName: string;
  gender: Gender;
  height: string;
  setDateOfBirth: (value: string) => void;
  setFullName: (value: string) => void;
  setGender: (value: Gender) => void;
  setHeight: (value: string) => void;
  setWeight: (value: string) => void;
  weight: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(() => dateOfBirth.split('-')[0] || '1997');
  const [draftMonth, setDraftMonth] = useState(() => dateOfBirth.split('-')[1] || '03');
  const [draftDay, setDraftDay] = useState(() => dateOfBirth.split('-')[2] || '11');

  const draftValue = useMemo(() => `${draftYear}-${draftMonth}-${draftDay}`, [draftDay, draftMonth, draftYear]);

  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Để đưa ra phân tích dinh dưỡng phù hợp với bạn, AI cần biết một số thông tin cơ bản về tình trạng thể chất của bạn."
        title="Hồ sơ sức khỏe"
      />
      <View className="gap-4 rounded-[12px] bg-card p-6" style={shadow}>
        <HealthInfoCard compact>
          Thông tin từ AI: Những dữ liệu này giúp chúng tôi tính toán chính xác hơn nhu cầu calo hằng ngày và khả năng hấp thụ dưỡng chất của bạn.
        </HealthInfoCard>
        <HealthField
          autoCapitalize="words"
          label="Họ và tên"
          onChangeText={setFullName}
          placeholder="e.g. Nguyễn An"
          value={fullName}
        />
        <View className="gap-2">
          <Text className="px-1 text-sm font-semibold text-muted">Ngày/tháng/năm sinh</Text>
          <Pressable
            accessibilityRole="button"
            className="h-14 flex-row items-center justify-between rounded-[8px] border-2 border-[#BCCABC] bg-card px-4"
            onPress={() => setPickerOpen(true)}
          >
            <Text className={`text-base ${dateOfBirth ? 'text-foreground' : 'text-[#6B7280]'}`}>
              {formatDateOfBirth(dateOfBirth)}
            </Text>
            <Feather color="#6D7A6E" name="calendar" size={18} />
          </Pressable>
        </View>
        <View className="gap-2">
          <Text className="px-1 text-sm font-semibold text-muted">Giới tính</Text>
          <View className="h-14 flex-row rounded-[12px] bg-[#EEEFF0] p-1">
            {(['Nam', 'Nữ', 'Khác'] as Gender[]).map((item) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: gender === item }}
                className={`flex-1 items-center justify-center rounded-[8px] ${gender === item ? 'bg-card' : ''}`}
                key={item}
                onPress={() => setGender(item)}
                style={gender === item ? { boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)' } : undefined}
              >
                <Text className={`text-sm font-semibold ${gender === item ? 'text-primary-700' : 'text-muted'}`}>
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
        <View className="flex-row gap-2 pt-2">
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

      <Modal animationType="slide" onRequestClose={() => setPickerOpen(false)} transparent visible={pickerOpen}>
        <View className="flex-1 justify-end bg-black/30">
          <View className="gap-5 rounded-t-[24px] bg-card px-5 pb-8 pt-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-foreground">Chọn ngày sinh</Text>
              <Pressable accessibilityRole="button" onPress={() => setPickerOpen(false)}>
                <Feather color="#3D4A3F" name="x" size={22} />
              </Pressable>
            </View>
            <View className="flex-row gap-3">
              <PickerColumn label="Ngày" onSelect={setDraftDay} options={days} value={draftDay} />
              <PickerColumn label="Tháng" onSelect={setDraftMonth} options={months} value={draftMonth} />
              <PickerColumn label="Năm" onSelect={setDraftYear} options={years} value={draftYear} />
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-14 items-center justify-center rounded-[12px] bg-primary-600"
              onPress={() => {
                setDateOfBirth(draftValue);
                setPickerOpen(false);
              }}
            >
              <Text className="text-base font-semibold text-white">Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}