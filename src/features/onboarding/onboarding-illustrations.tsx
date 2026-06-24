import { Text, View, type DimensionValue } from 'react-native';

import { colors } from '@/src/constants/tokens';

type IllustrationProps = {
  id: 'scan' | 'analyze' | 'personalized';
};

export function OnboardingIllustration({ id }: IllustrationProps) {
  if (id === 'scan') {
    return <ScanIllustration />;
  }

  if (id === 'analyze') {
    return <AnalyzeIllustration />;
  }

  return <PersonalizedIllustration />;
}

function ScanIllustration() {
  return (
    <View className="w-full items-center justify-center py-4">
      <View className="absolute h-72 w-72 rounded-full bg-[#7EFBA4] opacity-20" />
      <View
        className="h-80 w-full max-w-[320px] overflow-hidden rounded-[24px] border-4 border-white bg-card p-5"
        style={{ boxShadow: '0 10px 18px rgba(16, 24, 40, 0.10)' }}>
        <View className="flex-1 rounded-[18px] bg-[#EEF7F1] p-5">
          <View className="mb-5 h-28 rounded-[16px] bg-white p-4">
            <View className="h-4 w-40 rounded-full bg-[#DDEBE2]" />
            <View className="mt-3 h-3 w-28 rounded-full bg-[#E8E8EA]" />
            <View className="mt-4 flex-row gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <View
                  key={index}
                  className="rounded-full bg-[#1A1C1E]"
                  style={{ height: index % 3 === 0 ? 42 : 34, width: index % 2 === 0 ? 4 : 7 }}
                />
              ))}
            </View>
          </View>

          <View className="flex-1 rounded-[18px] border border-[#D8E3DC] bg-white p-4">
            <View className="flex-row items-center justify-between">
              <View className="h-4 w-24 rounded-full bg-[#E2E2E5]" />
              <View className="h-8 w-8 rounded-full bg-primary-600" />
            </View>
            <View className="mt-5 gap-3">
              <View className="h-3 rounded-full bg-[#EEEEF0]" />
              <View className="h-3 w-10/12 rounded-full bg-[#EEEEF0]" />
              <View className="h-3 w-8/12 rounded-full bg-[#EEEEF0]" />
            </View>
          </View>
        </View>
        <View
          className="absolute left-14 right-14 top-1/2 h-1 rounded-full bg-primary-700"
          style={{ boxShadow: '0 0 15px rgba(0, 109, 55, 0.65)' }}
        />
      </View>
    </View>
  );
}

function AnalyzeIllustration() {
  return (
    <View className="w-full items-center justify-center py-3">
      <View className="absolute left-3 h-56 w-44 rounded-full bg-[#61DE8A] opacity-20" />
      <View className="absolute right-0 h-60 w-48 rounded-full bg-[#58BCFD] opacity-20" />
      <View
        className="h-[360px] w-full max-w-[320px] overflow-hidden rounded-[32px] border border-white bg-card px-6 py-7"
        style={{ boxShadow: '0 16px 34px rgba(16, 24, 40, 0.08)' }}>
        <View className="border-b-2 border-[#EEF1EF] pb-5">
          <View className="h-4 w-52 rounded bg-[#EEEEF0]" />
          <View className="mt-3 h-2 w-36 rounded bg-[#E2E2E5]" />
          <View className="mt-4 h-0.5 rounded-full bg-primary-600" />
        </View>

        <View className="mt-5 flex-row gap-3">
          <MetricCard color={colors.primaryDark} label="Energy" valueWidth="66%" />
          <MetricCard color="#006492" label="Proteins" valueWidth="50%" />
        </View>

        <View className="mt-5 rounded-[16px] border border-primary-100 bg-primary-50 p-4">
          <View className="flex-row gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-600">
              <Text className="text-lg font-bold text-white">AI</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary-700">AI Recommendation</Text>
              <Text className="mt-1 text-xs leading-4 text-muted">
                Analyzing ingredient synergy for digestive health...
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function MetricCard({
  color,
  label,
  valueWidth,
}: {
  color: string;
  label: string;
  valueWidth: DimensionValue;
}) {
  return (
    <View
      className="flex-1 rounded-[16px] border border-white/60 bg-white/80 p-4"
      style={{ boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)' }}>
      <Text className="text-sm font-semibold text-muted">{label}</Text>
      <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEEEF0]">
        <View className="h-full rounded-full" style={{ backgroundColor: color, width: valueWidth }} />
      </View>
    </View>
  );
}

function PersonalizedIllustration() {
  return (
    <View className="w-full items-center justify-center py-3">
      <View className="absolute h-72 w-72 rounded-full bg-primary-600 opacity-10" />
      <View className="absolute right-8 top-4 h-11 w-11 rotate-12 rounded-full bg-[#FFE7C2]" />
      <View className="absolute bottom-16 left-8 h-11 w-11 -rotate-12 rounded-full bg-[#DDF3FF]" />
      <View
        className="w-[280px] rounded-[12px] border-t-4 border-primary-700 bg-card px-6 pb-6 pt-7"
        style={{ boxShadow: '0 16px 32px rgba(16, 24, 40, 0.08)' }}>
        <View className="flex-row items-start justify-between">
          <View className="gap-2">
            <View className="h-4 w-32 rounded-full bg-[#E8E8EA]" />
            <View className="h-3 w-20 rounded-full bg-[#EEEEF0]" />
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-600">
            <Text className="text-xl font-bold text-white">✓</Text>
          </View>
        </View>

        <View className="mt-7 gap-4">
          <ReportRow accent="#58BCFD" width={40} />
          <ReportRow accent="#D98437" width={48} />
          <ReportRow accent={colors.border} width={32} />
        </View>

        <View className="mt-5 rounded-[8px] border border-[#DDE8DD] bg-[#F3F3F6] p-3">
          <Text className="text-center text-sm font-semibold text-muted">Recommended for You</Text>
        </View>
      </View>
    </View>
  );
}

function ReportRow({ accent, width }: { accent: string; width: number }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-8 w-8 rounded-[8px]" style={{ backgroundColor: `${accent}33` }} />
      <View className="h-3 flex-1 rounded-full bg-[#EEEEF0]" />
      <View className="h-3 rounded-full bg-[#61DE8A]" style={{ width }} />
    </View>
  );
}
