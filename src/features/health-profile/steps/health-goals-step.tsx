import { View } from 'react-native';

import { HealthInfoCard } from '../components/health-info-card';
import { HealthOptionList } from '../components/health-option-list';
import { HealthSectionHeader } from '../components/health-profile-header';
import { goals } from '../data/health-profile-options';

export function HealthGoalsStep({ goal, setGoal }: { goal: string; setGoal: (id: string) => void }) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        subtitle="Điều này giúp chúng tôi cá nhân hóa các khuyến nghị dinh dưỡng hằng ngày và mục tiêu calo phù hợp với bạn."
        title="Mục tiêu sức khỏe của bạn là gì?"
      />
      <HealthOptionList options={goals} selected={goal} setSelected={setGoal} />
      <HealthInfoCard>
        Mục tiêu này giúp Nutelyt ưu tiên cách phân tích calo, protein và khẩu phần phù hợp
        với nhu cầu hiện tại của bạn.
      </HealthInfoCard>
    </View>
  );
}