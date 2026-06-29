import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/constants/tokens';

import type { HealthProfileSummary } from '../types';
import { getProfileDietChips, getProfileScore } from '../utils/health-profile';

export function HealthProfileCard({
  onEdit,
  profile,
}: {
  onEdit: () => void;
  profile: HealthProfileSummary;
}) {
  const chips = getProfileDietChips(profile);

  return (
    <View
      className="flex-row items-center gap-4 overflow-hidden rounded-[12px] border border-[#EEEEF0] bg-card p-[21px]"
      style={{ boxShadow: '0 16px 32px rgba(45, 156, 219, 0.06)' }}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-600">
        <Feather color="#FFFFFF" name="shield" size={28} />
      </View>
      <View className="min-w-0 flex-1 gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-[20px] font-semibold leading-7 text-foreground">Health Profile</Text>
          <Text className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
            {getProfileScore(profile)}
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {chips.map((chip) => (
            <View className="rounded-full border border-[#BCCABC4D] bg-[#E2E2E5] px-[13px] py-[5px]" key={chip}>
              <Text className="text-sm font-semibold leading-5 text-muted">{chip}</Text>
            </View>
          ))}
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        className="h-10 w-10 items-center justify-center rounded-full bg-[#F3F3F6]"
        onPress={onEdit}
      >
        <Feather color={colors.primaryDark} name="edit-2" size={18} />
      </Pressable>
    </View>
  );
}
