import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/config/routes';
import { colors } from '@/theme/tokens';

import { commonAllergies, dietOptions, goalSpeedOptions } from '../config/health-profile-options';
import type { DietPreference, Gender, GoalSpeed } from '../health-profile.types';
import { getHealthProfilePresentation } from '../utils/health-profile';
import { useHealthProfileWizard } from '../use-health-profile-wizard';

const wordmarkImage = require('@assets/images/Nutelyt-text.png');
const mascotImage = require('@assets/images/Nutelyt-AI.png');
const genderOptions: Gender[] = ['Nam', 'Nữ', 'Khác'];

function Field({
  error,
  label,
  onChangeText,
  placeholder,
  suffix,
  value,
  ...props
}: {
  error?: string;
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  suffix?: string;
  value: string;
} & Omit<React.ComponentProps<typeof TextInput>, 'onChangeText' | 'value'>) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-muted">{label}</Text>
      <View style={[styles.input, error ? styles.inputError : undefined]}>
        <TextInput
          accessibilityLabel={label}
          className="h-full flex-1 text-base text-foreground"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#869087"
          value={value}
          {...props}
        />
        {suffix ? <Text className="text-sm font-semibold text-muted">{suffix}</Text> : null}
      </View>
      {error ? <Text accessibilityLiveRegion="polite" className="text-sm text-[#C02828]">{error}</Text> : null}
    </View>
  );
}

function ChoiceCard({
  checked,
  description,
  label,
  onPress,
}: {
  checked: boolean;
  description: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked }}
      className="min-h-[76px] flex-row items-center gap-3 rounded-2xl border bg-card px-4 py-3"
      onPress={onPress}
      style={[styles.choice, checked ? styles.choiceSelected : undefined]}
    >
      <View style={[styles.radio, checked ? styles.radioSelected : undefined]}>
        {checked ? <View style={styles.radioDot} /> : null}
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        <Text className="text-sm leading-5 text-muted">{description}</Text>
      </View>
    </Pressable>
  );
}

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <View className="gap-2">
      <Text className="text-[28px] font-semibold leading-9 text-foreground">{title}</Text>
      <Text className="text-base leading-6 text-muted">{subtitle}</Text>
    </View>
  );
}

function ReviewCard({ children, onEdit, title }: { children: React.ReactNode; onEdit: () => void; title: string }) {
  return (
    <View className="gap-4 rounded-2xl bg-card p-4" style={styles.cardShadow}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Pressable accessibilityLabel={`Chỉnh sửa ${title}`} accessibilityRole="button" hitSlop={8} onPress={onEdit}>
          <Text className="text-sm font-semibold text-primary-700">Chỉnh sửa</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-5">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="flex-1 text-right text-sm font-semibold text-foreground">{value}</Text>
    </View>
  );
}

export function HealthProfileFlowScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { edit, finish, next, previous, setValue, state, toggleAllergy, totalSteps } = useHealthProfileWizard();
  const [allergySearch, setAllergySearch] = useState('');
  const { fieldErrors, isSubmitting, step, values } = state;
  const presentation = getHealthProfilePresentation(values);
  const filteredAllergies = commonAllergies.filter((allergy) =>
    allergy.toLocaleLowerCase('vi-VN').includes(allergySearch.trim().toLocaleLowerCase('vi-VN'))
  );

  const goBack = () => {
    if (step > 0) {
      previous();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(routes.login);
    }
  };

  const continueFlow = () => {
    if (step === totalSteps - 1) {
      if (finish()) router.replace(routes.home);
      return;
    }
    next();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="h-16 flex-row items-center justify-between border-b border-[#E9ECE9] bg-card px-5">
          <Pressable accessibilityLabel="Quay lại" accessibilityRole="button" className="h-12 w-12 items-center justify-center" onPress={goBack}>
            <Feather color={colors.primaryDark} name="chevron-left" size={26} />
          </Pressable>
          <Image accessibilityLabel="Nutelyt" className="h-7 w-28" contentFit="contain" source={wordmarkImage} />
          <Text accessibilityLiveRegion="polite" className="w-12 text-right text-sm font-semibold text-muted">
            {step + 1}/{totalSteps}
          </Text>
        </View>

        <View accessibilityLabel={`Tiến trình bước ${step + 1} trên ${totalSteps}`} accessibilityRole="progressbar" className="flex-row gap-2 px-5 py-4">
          {Array.from({ length: totalSteps }, (_, index) => (
            <View className="h-1 flex-1 overflow-hidden rounded-full bg-[#E1E7E2]" key={index}>
              <View className="h-full rounded-full bg-primary-600" style={{ width: index <= step ? '100%' : '0%' }} />
            </View>
          ))}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 112, 136) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 ? (
            <View className="gap-6">
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" style={styles.mascotWrap}>
                <Image className="h-24 w-24" contentFit="contain" source={mascotImage} />
              </View>
              <SectionTitle subtitle="Hãy cho Nutelyt biết một vài thông tin để tạo kế hoạch giảm cân phù hợp." title="Thông tin cơ bản" />
              <View className="gap-4 rounded-2xl bg-card p-5" style={styles.cardShadow}>
                <Field
                  autoCapitalize="words"
                  autoComplete="name"
                  error={fieldErrors.fullName}
                  label="Họ và tên"
                  onChangeText={(value) => setValue('fullName', value)}
                  placeholder="Nguyễn An"
                  value={values.fullName}
                />
                <Field
                  autoCapitalize="none"
                  error={fieldErrors.birthday}
                  label="Ngày sinh"
                  maxLength={10}
                  onChangeText={(value) => setValue('birthday', value)}
                  placeholder="YYYY-MM-DD"
                  value={values.birthday}
                />
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-muted">Giới tính</Text>
                  <View accessibilityRole="radiogroup" className="flex-row gap-2">
                    {genderOptions.map((gender) => {
                      const checked = values.gender === gender;
                      return (
                        <Pressable
                          accessibilityRole="radio"
                          accessibilityState={{ checked }}
                          className="min-h-12 flex-1 items-center justify-center rounded-xl border"
                          key={gender}
                          onPress={() => setValue('gender', gender)}
                          style={checked ? styles.genderSelected : styles.gender}
                        >
                          <Text className={`text-sm font-semibold ${checked ? 'text-primary-700' : 'text-muted'}`}>{gender}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {fieldErrors.gender ? <Text className="text-sm text-[#C02828]">{fieldErrors.gender}</Text> : null}
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Field error={fieldErrors.height} keyboardType="decimal-pad" label="Chiều cao" onChangeText={(value) => setValue('height', value)} placeholder="170" suffix="cm" value={values.height} />
                  </View>
                  <View className="flex-1">
                    <Field error={fieldErrors.currentWeight} keyboardType="decimal-pad" label="Cân nặng hiện tại" onChangeText={(value) => setValue('currentWeight', value)} placeholder="65" suffix="kg" value={values.currentWeight} />
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View className="gap-6">
              <SectionTitle subtitle="Đặt cân nặng mong muốn và tốc độ giảm cân bạn cảm thấy phù hợp." title="Mục tiêu cân nặng" />
              <View className="rounded-2xl bg-card p-5" style={styles.cardShadow}>
                <Field error={fieldErrors.targetWeight} keyboardType="decimal-pad" label="Cân nặng mục tiêu" onChangeText={(value) => setValue('targetWeight', value)} placeholder="58" suffix="kg" value={values.targetWeight} />
              </View>
              <View className="gap-3">
                <Text className="text-base font-semibold text-foreground">Tốc độ giảm cân</Text>
                <View accessibilityRole="radiogroup" className="gap-3">
                  {goalSpeedOptions.map((option) => (
                    <ChoiceCard checked={values.goalSpeed === option.id} description={option.description} key={option.id} label={option.label} onPress={() => setValue('goalSpeed', option.id as GoalSpeed)} />
                  ))}
                </View>
                {fieldErrors.goalSpeed ? <Text className="text-sm text-[#C02828]">{fieldErrors.goalSpeed}</Text> : null}
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View className="gap-6">
              <SectionTitle subtitle="Chọn một chế độ ăn và thêm những thực phẩm bạn cần tránh." title="Chế độ ăn & dị ứng" />
              <View accessibilityRole="radiogroup" className="gap-3">
                {dietOptions.map((option) => (
                  <ChoiceCard checked={values.diet === option.id} description={option.description} key={option.id} label={option.label} onPress={() => setValue('diet', option.id as DietPreference)} />
                ))}
              </View>
              {fieldErrors.diet ? <Text className="text-sm text-[#C02828]">{fieldErrors.diet}</Text> : null}
              <View className="gap-3 rounded-2xl bg-card p-5" style={styles.cardShadow}>
                <Text className="text-base font-semibold text-foreground">Dị ứng thực phẩm (nếu có)</Text>
                <View style={styles.searchInput}>
                  <Feather color="#6D7A6E" name="search" size={18} />
                  <TextInput accessibilityLabel="Tìm dị ứng" className="ml-2 flex-1 text-base text-foreground" onChangeText={setAllergySearch} placeholder="Tìm thực phẩm" placeholderTextColor="#869087" value={allergySearch} />
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {filteredAllergies.map((allergy) => {
                    const selected = values.allergies.includes(allergy);
                    return (
                      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }} className="min-h-11 rounded-full border px-4 py-2" key={allergy} onPress={() => toggleAllergy(allergy)} style={selected ? styles.chipSelected : styles.chip}>
                        <Text className={`text-sm font-semibold ${selected ? 'text-primary-700' : 'text-muted'}`}>{allergy}</Text>
                      </Pressable>
                    );
                  })}
                  {!filteredAllergies.length ? <Text className="text-sm text-muted">Không tìm thấy dị ứng phổ biến phù hợp.</Text> : null}
                </View>
              </View>
            </View>
          ) : null}

          {step === 3 ? (
            <View className="gap-5">
              <SectionTitle subtitle="Kiểm tra lại thông tin trước khi Nutelyt tạo kế hoạch giảm cân cho bạn." title="Xem lại hồ sơ" />
              <ReviewCard onEdit={() => edit(0)} title="Thông tin cơ bản">
                <View className="gap-3">
                  <DetailRow label="Họ và tên" value={values.fullName} />
                  <DetailRow label="Ngày sinh" value={values.birthday} />
                  <DetailRow label="Giới tính" value={values.gender ?? '--'} />
                  <DetailRow label="Chiều cao" value={`${values.height} cm`} />
                  <DetailRow label="Cân nặng hiện tại" value={`${values.currentWeight} kg`} />
                </View>
              </ReviewCard>
              <ReviewCard onEdit={() => edit(1)} title="Mục tiêu cân nặng">
                <View className="gap-3">
                  <DetailRow label="Cân nặng mục tiêu" value={`${values.targetWeight} kg`} />
                  <DetailRow label="Tốc độ" value={presentation.goalSpeedLabel} />
                </View>
              </ReviewCard>
              <ReviewCard onEdit={() => edit(2)} title="Chế độ ăn & dị ứng">
                <View className="gap-3">
                  <DetailRow label="Chế độ ăn" value={presentation.dietLabel} />
                  <DetailRow label="Dị ứng" value={presentation.allergiesLabel} />
                </View>
              </ReviewCard>
              <View className="flex-row items-center gap-4 rounded-2xl bg-primary-50 p-5">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-600">
                  <Feather color="#FFFFFF" name="heart" size={21} />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-primary-700">BMI của bạn</Text>
                  <Text className="text-sm leading-5 text-primary-700">
                    {presentation.bmiValue?.toFixed(1) ?? '--'} · {presentation.bmiCategory}
                  </Text>
                </View>
              </View>
              {fieldErrors.fullName ? <Text accessibilityLiveRegion="polite" className="text-sm text-[#C02828]">{fieldErrors.fullName}</Text> : null}
            </View>
          ) : null}
        </ScrollView>

        <View className="border-t border-[#E9ECE9] bg-card px-5 pt-4" style={{ paddingBottom: Math.max(insets.bottom + 12, 20) }}>
          <Pressable accessibilityLabel={step === totalSteps - 1 ? 'Hoàn tất hồ sơ sức khỏe' : 'Tiếp tục'} accessibilityRole="button" accessibilityState={{ disabled: isSubmitting }} className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-primary-600" disabled={isSubmitting} onPress={continueFlow} style={isSubmitting ? styles.buttonDisabled : styles.buttonShadow}>
            <Text className="text-base font-semibold text-white">{isSubmitting ? 'Đang lưu...' : step === totalSteps - 1 ? 'Hoàn tất' : 'Tiếp tục'}</Text>
            {!isSubmitting ? <Feather color="#FFFFFF" name={step === totalSteps - 1 ? 'check' : 'arrow-right'} size={18} /> : null}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonDisabled: { opacity: 0.6 },
  buttonShadow: { boxShadow: '0 8px 18px rgba(39, 174, 96, 0.25)' },
  cardShadow: { boxShadow: '0 4px 16px rgba(24, 39, 27, 0.06)' },
  chip: { borderColor: '#D7DFD8' },
  chipSelected: { backgroundColor: '#ECFDF3', borderColor: colors.primary },
  choice: { borderColor: '#D7DFD8' },
  choiceSelected: { backgroundColor: '#F3FCF6', borderColor: colors.primary },
  content: { flexGrow: 1, gap: 24, paddingHorizontal: 20, paddingTop: 8 },
  gender: { borderColor: '#D7DFD8' },
  genderSelected: { backgroundColor: '#ECFDF3', borderColor: colors.primary },
  input: { alignItems: 'center', borderColor: '#D7DFD8', borderRadius: 12, borderWidth: 1, flexDirection: 'row', height: 54, paddingHorizontal: 14 },
  inputError: { borderColor: '#C02828' },
  mascotWrap: { alignItems: 'flex-end', height: 42, overflow: 'visible' },
  radio: { alignItems: 'center', borderColor: '#A6B2A7', borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', width: 20 },
  radioDot: { backgroundColor: '#FFFFFF', borderRadius: 4, height: 8, width: 8 },
  radioSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  searchInput: { alignItems: 'center', borderColor: '#D7DFD8', borderRadius: 12, borderWidth: 1, flexDirection: 'row', height: 48, paddingHorizontal: 14 },
});
