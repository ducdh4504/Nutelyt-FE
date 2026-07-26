import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function AIAnalysisCard({ body, chips }: { body: string; chips: string[] }) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-2 px-1">
        <Feather color="#006D37" name="zap" size={20} />
        <Text className="text-[20px] font-semibold leading-7 text-foreground">
          Phân tích sức khỏe từ AI
        </Text>
      </View>
      <View className="gap-5 rounded-[12px] border border-[#006D371A] bg-[#006D370D] p-[25px]">
        <Text className="text-base leading-7 text-muted">{body}</Text>
        <View className="flex-row flex-wrap gap-2">
          {chips.map((chip) => (
            <View className="rounded-full border border-[#006D3733] bg-card px-[13px] py-[5px]" key={chip}>
              <Text className="text-sm font-semibold leading-5 text-primary-700">{chip}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
