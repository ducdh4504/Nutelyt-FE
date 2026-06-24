import { View } from 'react-native';

type OnboardingProgressDotsProps = {
  activeIndex: number;
  total: number;
};

export function OnboardingProgressDots({ activeIndex, total }: OnboardingProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <View
            key={index}
            className={isActive ? 'h-2 rounded-full bg-primary-700' : 'h-2 w-2 rounded-full bg-border'}
            style={{ width: isActive ? (activeIndex === 1 ? 32 : 24) : 8 }}
          />
        );
      })}
    </View>
  );
}
