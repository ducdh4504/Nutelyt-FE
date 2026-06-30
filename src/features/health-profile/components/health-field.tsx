import { Text, TextInput, View, type TextInputProps } from 'react-native';

export function HealthField({
  className = '',
  label,
  suffix,
  ...props
}: TextInputProps & {
  className?: string;
  label: string;
  suffix?: string;
}) {
  return (
    <View className={`gap-2 ${className}`}>
      <Text className="px-1 text-sm font-semibold text-muted">{label}</Text>
      <View className="h-14 flex-row items-center rounded-[8px] border-2 border-[#BCCABC] bg-card px-4">
        <TextInput
          className="h-full flex-1 text-lg text-foreground"
          placeholderTextColor="#6B7280"
          {...props}
        />
        {suffix ? <Text className="text-base text-muted">{suffix}</Text> : null}
      </View>
    </View>
  );
}