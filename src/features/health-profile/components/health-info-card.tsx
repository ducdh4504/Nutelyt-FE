import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function HealthInfoCard({ children, compact = false }: { children: string; compact?: boolean }) {
  return (
    <View
      className={`flex-row gap-3 rounded-[12px] border border-[#DCE6DD] bg-[#F3F3F6] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <Feather color="#006492" name="info" size={20} />
      <Text
        className={`${compact ? 'text-sm leading-[22px]' : 'text-base leading-6'} flex-1 text-muted`}
      >
        {children}
      </Text>
    </View>
  );
}