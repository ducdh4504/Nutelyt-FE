import { View } from 'react-native';

import { HealthInfoCard } from '../components/health-info-card';
import { HealthSectionHeader } from '../components/health-profile-header';

export function UsagePurposeStep() {
  return (
    <View className="gap-6">
      <HealthSectionHeader
        centered
        subtitle="Bước này đã được thay thế bằng luồng hồ sơ sức khỏe mới."
        title="Mục đích sử dụng"
      />
      <HealthInfoCard>
        Màn hình này không còn nằm trong luồng thiết lập hồ sơ sức khỏe hiện tại.
      </HealthInfoCard>
    </View>
  );
}