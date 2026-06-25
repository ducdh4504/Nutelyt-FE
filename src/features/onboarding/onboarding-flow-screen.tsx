import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "@/src/components/layout";
import { Button, Typography } from "@/src/components/ui";

import { ONBOARDING_STEPS } from "./onboarding-data";
import { OnboardingIllustration } from "./onboarding-illustrations";
import { OnboardingProgressDots } from "./onboarding-progress-dots";

const TRANSITION_OUT_MS = 110;
const TRANSITION_IN_MS = 170;
const wordmarkImage = require("../../../assets/images/Nutelyt-text.png");

export function OnboardingFlowScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const transitionProgress = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const step = ONBOARDING_STEPS[activeIndex];
  const isFinalStep = activeIndex === ONBOARDING_STEPS.length - 1;

  function animateToStep(nextIndex: number, direction: number) {
    if (isTransitioning || nextIndex === activeIndex) {
      return;
    }

    setIsTransitioning(true);
    setSlideDirection(direction);

    Animated.timing(transitionProgress, {
      duration: TRANSITION_OUT_MS,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setActiveIndex(nextIndex);
      transitionProgress.setValue(0);

      Animated.timing(transitionProgress, {
        duration: TRANSITION_IN_MS,
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false);
      });
    });
  }

  function handleContinue() {
    if (isTransitioning) {
      return;
    }

    if (isFinalStep) {
      router.replace("/login");
      return;
    }

    animateToStep(activeIndex + 1, 1);
  }

  function handleBack() {
    animateToStep(Math.max(activeIndex - 1, 0), -1);
  }

  function handleSkip() {
    animateToStep(ONBOARDING_STEPS.length - 1, 1);
  }

  const animatedContentStyle = {
    opacity: transitionProgress,
    transform: [
      {
        translateX: transitionProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [slideDirection * 18, 0],
        }),
      },
    ],
  };

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
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            className="flex-1 items-center justify-between"
            style={animatedContentStyle}
          >
            <View className="w-full max-w-[384px]">
              <OnboardingIllustration id={step.id} />
            </View>

            <View className="w-full max-w-[448px] items-center gap-4 pb-3">
              <Typography
                className="text-center text-2xl leading-9"
                variant="subtitle"
              >
                {step.title}
              </Typography>
              <Typography
                className="px-2 text-center text-[15px] leading-7"
                tone="muted"
              >
                {step.description}
              </Typography>

              {!isFinalStep ? (
                <View className="pt-5">
                  <OnboardingProgressDots
                    activeIndex={activeIndex}
                    total={ONBOARDING_STEPS.length}
                  />
                </View>
              ) : null}
            </View>
          </Animated.View>
        </ScrollView>

        <View
          className="items-center gap-4 px-5 pt-4"
          style={{
            paddingBottom: isFinalStep
              ? Math.max(insets.bottom, 32)
              : Math.max(insets.bottom, 20),
          }}
        >
          {isFinalStep ? (
            <View className="pb-3">
              <OnboardingProgressDots
                activeIndex={activeIndex}
                total={ONBOARDING_STEPS.length}
              />
            </View>
          ) : null}

          <Button
            className="h-14 w-full max-w-[384px] rounded-[12px] border-primary-600 bg-primary-600"
            disabled={isTransitioning}
            onPress={handleContinue}
            size="lg"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text
                className={
                  isFinalStep
                    ? "text-lg text-white"
                    : "text-sm font-semibold text-white"
                }
              >
                {step.primaryLabel}
              </Text>
              <Text className="text-lg font-semibold text-white">→</Text>
            </View>
          </Button>

          {step.secondaryLabel ? (
            <Pressable
              accessibilityRole="button"
              className="min-h-12 justify-center px-6"
              disabled={isTransitioning}
              onPress={handleSkip}
            >
              <Text className="text-center text-sm font-semibold text-muted">
                {step.secondaryLabel}
              </Text>
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
      <View className="h-12 w-20 items-start justify-center">
        {canGoBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="h-12 w-12 items-center justify-center rounded-full"
            onPress={onBack}
          >
            <Text className="text-2xl text-foreground">‹</Text>
          </Pressable>
        ) : null}
      </View>

      <View
        className="absolute inset-x-0 top-0 h-14 items-center justify-center"
        pointerEvents="none"
      >
        <Image
          accessibilityLabel="Nutelyt"
          className="h-7 w-28"
          resizeMode="contain"
          source={wordmarkImage}
        />
      </View>

      {canSkip ? (
        <View className="h-12 w-20 items-end justify-center">
          <Pressable
            accessibilityRole="button"
            className="min-h-12 justify-center rounded-[12px] px-4"
            onPress={onSkip}
          >
            <Text className="text-sm font-semibold text-[#006492]">Bỏ qua</Text>
          </Pressable>
        </View>
      ) : (
        <View className="h-12 w-20" />
      )}
    </View>
  );
}
