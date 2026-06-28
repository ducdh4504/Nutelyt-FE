import { View } from 'react-native';

import { HealthInfoCard } from '../components/health-info-card';
import { HealthOptionList } from '../components/health-option-list';
import { HealthSectionHeader } from '../components/health-profile-header';
import { purposes } from '../data/health-profile-options';

export function UsagePurposeStep({
  purpose,
  setPurpose,
}: {
  purpose: string;
  setPurpose: (id: string) => void;
}) {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Mục đích của bạn khi sử dụng Nutelyt"
        title="Mục đích sử dụng"
      />
      <HealthOptionList options={purposes} selected={purpose} setSelected={setPurpose} />
      <HealthInfoCard>
        Lựa chọn này chỉ ảnh hưởng đến cách AI đưa ra gợi ý và không giới hạn các tính năng
        của ứng dụng. Bạn luôn có thể cập nhật khi nhu cầu thay đổi.
      </HealthInfoCard>
    </View>
  );
}