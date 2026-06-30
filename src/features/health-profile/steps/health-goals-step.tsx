import { View } from 'react-native';

import { HealthInfoCard } from '../components/health-info-card';
import { HealthOptionList } from '../components/health-option-list';
import { HealthSectionHeader } from '../components/health-profile-header';
import { goals } from '../data/health-profile-options';

export function HealthGoalsStep({ goal, setGoal }: { goal: string; setGoal: (id: string) => void }) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Điều này giúp chúng tôi cá nhân hóa các khuyến nghị dinh dưỡng hằng ngày và mục tiêu calo phù hợp với bạn."
        title="Mục tiêu sức khỏe của bạn là gì?"
      />
      <HealthOptionList options={goals} selected={goal} setSelected={setGoal} />
      <HealthInfoCard>
        Mục tiêu sức khỏe có thể được điều chỉnh bất cứ lúc nào trong Cài đặt hồ sơ. Người dùng từ 60 tuổi trở lên nên tham khảo ý kiến chuyên gia y tế trước khi thực hiện kế hoạch tăng hoặc giảm cân.
      </HealthInfoCard>
    </View>
  );
}