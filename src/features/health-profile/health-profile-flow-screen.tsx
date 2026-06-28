import { useRouter, type Href } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthPrimaryButton } from './components/health-primary-button';
import { HealthProfileHeader } from './components/health-profile-header';
import { HealthProgress } from './components/health-progress';
import { HealthSecondaryButton } from './components/health-secondary-button';
import { BasicHealthProfileStep } from './steps/basic-health-profile-step';
import { DietPreferenceStep } from './steps/diet-preference-step';
import { HealthGoalsStep } from './steps/health-goals-step';
import { MedicalConditionsStep } from './steps/medical-conditions-step';
import { UsagePurposeStep } from './steps/usage-purpose-step';
import type { Gender } from './types';

export function HealthProfileFlowScreen() {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 320,
      toValue: (step + 1) / 5,
      useNativeDriver: false,
    }).start();
  }, [progress, step]);

  const animateTo = (nextStep: number) => {
    const direction = nextStep > step ? 1 : -1;
    Animated.parallel([
      Animated.timing(opacity, { duration: 120, toValue: 0, useNativeDriver: true }),
      Animated.timing(translateX, {
        duration: 120,
        toValue: -18 * direction,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      translateX.setValue(24 * direction);
      Animated.parallel([
        Animated.timing(opacity, { duration: 220, toValue: 1, useNativeDriver: true }),
        Animated.spring(translateX, {
          damping: 18,
          stiffness: 170,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goBack = () => {
    if (step === 0) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/login');
      }
      return;
    }
    animateTo(step - 1);
  };

  const canContinue =
    step === 0
      ? Boolean(purpose)
      : step === 1
        ? Boolean(fullName.trim() && age.trim() && gender && height.trim() && weight.trim())
        : step === 2
          ? true
          : step === 3
            ? Boolean(goal)
            : Boolean(diet);

  const continueFlow = () => {
    if (!canContinue) {
      return;
    }
    if (step === 4) {
      router.push('/health-profile/complete' as Href);
      return;
    }
    animateTo(step + 1);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <HealthProfileHeader onBack={goBack} step={step} />
        <HealthProgress width={progressWidth} />

        <Animated.View className="flex-1" style={{ opacity, transform: [{ translateX }] }}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              gap: 24,
              paddingBottom: 24,
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 ? <UsagePurposeStep purpose={purpose} setPurpose={setPurpose} /> : null}

            {step === 1 ? (
              <BasicHealthProfileStep
                age={age}
                fullName={fullName}
                gender={gender}
                height={height}
                setAge={setAge}
                setFullName={setFullName}
                setGender={setGender}
                setHeight={setHeight}
                setWeight={setWeight}
                weight={weight}
              />
            ) : null}

            {step === 2 ? (
              <MedicalConditionsStep
                selectedConditions={selectedConditions}
                setSelectedConditions={setSelectedConditions}
              />
            ) : null}

            {step === 3 ? <HealthGoalsStep goal={goal} setGoal={setGoal} /> : null}

            {step === 4 ? <DietPreferenceStep diet={diet} setDiet={setDiet} /> : null}
          </ScrollView>
        </Animated.View>

        <View
          className="border-t border-[#E2E2E5] bg-card px-5 py-5"
          style={{
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
            paddingBottom: Math.max(insets.bottom + 12, 20),
          }}
        >
          <HealthPrimaryButton disabled={!canContinue} onPress={continueFlow} />
          {step === 2 ? (
            <HealthSecondaryButton
              onPress={() => {
                setSelectedConditions([]);
                animateTo(3);
              }}
            >
              Tôi không có bệnh lý nào.
            </HealthSecondaryButton>
          ) : null}
          {step === 4 ? (
            <HealthSecondaryButton
              onPress={() => {
                setDiet('');
                router.push('/health-profile/complete' as Href);
              }}
            >
              Tôi không theo chế độ ăn nào.
            </HealthSecondaryButton>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}