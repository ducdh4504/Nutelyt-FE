import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ScreenContainer } from '@/src/components/layout';
import { Button, Typography } from '@/src/components/ui';

import { ONBOARDING_STEPS } from './onboarding-data';
import { OnboardingIllustration } from './onboarding-illustrations';
import { OnboardingProgressDots } from './onboarding-progress-dots';

export function OnboardingFlowScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const step = ONBOARDING_STEPS[activeIndex];
  const isFinalStep = activeIndex === ONBOARDING_STEPS.length - 1;

  function handleContinue() {
    if (isFinalStep) {
      router.replace('/login');
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  function handleBack() {
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function handleSkip() {
    setActiveIndex(ONBOARDING_STEPS.length - 1);
  }

  return (
    <ScreenContainer className="bg-background" contentClassName="px-0 py-0">
      <View className="flex-1 bg-background">
        <OnboardingHeader
          canGoBack={activeIndex > 0}
          canSkip={!isFinalStep}
          onBack={handleBack}
          onSkip={handleSkip}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 items-center justify-between">
            <View className="w-full max-w-[384px]">
              <OnboardingIllustration id={step.id} />
            </View>

            <View className="w-full max-w-[448px] items-center gap-4 pb-3">
              <Typography className="text-center text-2xl leading-9" variant="subtitle">
                {step.title}
              </Typography>
              <Typography className="px-2 text-center text-[15px] leading-7" tone="muted">
                {step.description}
              </Typography>

              {!isFinalStep ? (
                <View className="pt-5">
                  <OnboardingProgressDots activeIndex={activeIndex} total={ONBOARDING_STEPS.length} />
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View
          className="items-center gap-4 px-5 pt-4"
          style={{ paddingBottom: isFinalStep ? Math.max(insets.bottom, 32) : Math.max(insets.bottom, 20) }}>
          {isFinalStep ? (
            <View className="pb-3">
              <OnboardingProgressDots activeIndex={activeIndex} total={ONBOARDING_STEPS.length} />
            </View>
          ) : null}

          <Button
            className="h-14 w-full max-w-[384px] rounded-[12px] border-primary-600 bg-primary-600"
            onPress={handleContinue}
            size="lg">
            <View className="flex-row items-center justify-center gap-2">
              <Text className={isFinalStep ? 'text-lg text-white' : 'text-sm font-semibold text-white'}>
                {step.primaryLabel}
              </Text>
              <Text className="text-lg font-semibold text-white">→</Text>
            </View>
          </Button>

          {step.secondaryLabel ? (
            <Pressable accessibilityRole="button" className="min-h-12 justify-center px-6" onPress={handleSkip}>
              <Text className="text-center text-sm font-semibold text-muted">{step.secondaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

function OnboardingHeader({
  canGoBack,
  canSkip,
  onBack,
  onSkip,
}: {
  canGoBack: boolean;
  canSkip: boolean;
  onBack: () => void;
  onSkip: () => void;
}) {
  return (
    <View className="h-14 flex-row items-center justify-between bg-background px-5">
      {canGoBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-12 w-12 items-center justify-center rounded-full"
          onPress={onBack}>
          <Text className="text-2xl text-foreground">‹</Text>
        </Pressable>
      ) : (
        <Text className="text-xl font-bold text-primary-700">Nutelyt</Text>
      )}

      {canGoBack ? <Text className="text-xl font-bold text-primary-700">Nutelyt</Text> : null}

      {canSkip ? (
        <Pressable accessibilityRole="button" className="min-h-12 justify-center rounded-[12px] px-4" onPress={onSkip}>
          <Text className="text-sm font-semibold text-[#006492]">Bỏ qua</Text>
        </Pressable>
      ) : (
        <View className="h-12 w-12" />
      )}
    </View>
  );
}
