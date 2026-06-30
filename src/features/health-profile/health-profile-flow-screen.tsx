import { useRouter, type Href } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { conditions, diets, goals } from './data/health-profile-options';
import { HealthPrimaryButton } from './components/health-primary-button';
import { HealthProfileHeader } from './components/health-profile-header';
import { HealthProgress } from './components/health-progress';
import { HealthSecondaryButton } from './components/health-secondary-button';
import { BasicHealthProfileStep } from './steps/basic-health-profile-step';
import { DietPreferenceStep } from './steps/diet-preference-step';
import { HealthGoalsStep } from './steps/health-goals-step';
import { MedicalConditionsStep } from './steps/medical-conditions-step';
import type { Gender, HealthProfilePayload } from './types';

const TOTAL_STEPS = 4;
const NO_DIET_LABEL = 'Không theo chế độ ăn nào';

function getOptionLabel(options: { id: string; label: string }[], id: string) {
  return options.find((item) => item.id === id)?.label ?? '';
}

export function HealthProfileFlowScreen() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>('Nam');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [noDiet, setNoDiet] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [allergyText, setAllergyText] = useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 320,
      toValue: (step + 1) / TOTAL_STEPS,
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
      ? Boolean(fullName.trim() && dateOfBirth && gender && height.trim() && weight.trim())
      : step === 1
        ? Boolean(selectedGoal)
        : step === 2
          ? Boolean(selectedDiet || noDiet)
          : true;

  const profilePayload = useMemo<HealthProfilePayload>(
    () => ({
      allergyText: allergyText.trim(),
      conditionLabels: selectedConditions.map((id) => getOptionLabel(conditions, id)).filter(Boolean),
      conditions: selectedConditions,
      dateOfBirth,
      diet: noDiet ? null : selectedDiet || null,
      dietLabel: noDiet ? NO_DIET_LABEL : getOptionLabel(diets, selectedDiet),
      fullName: fullName.trim(),
      gender,
      goal: selectedGoal,
      goalLabel: getOptionLabel(goals, selectedGoal),
      height: height.trim(),
      weight: weight.trim(),
    }),
    [allergyText, dateOfBirth, fullName, gender, height, noDiet, selectedConditions, selectedDiet, selectedGoal, weight]
  );

  const navigateToProfile = () => {
    router.push({
      pathname: '/profile',
      params: { profile: JSON.stringify(profilePayload) },
    } as unknown as Href);
  };

  const continueFlow = () => {
    if (!canContinue) {
      return;
    }
    if (step === TOTAL_STEPS - 1) {
      navigateToProfile();
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
        <HealthProfileHeader onBack={goBack} step={step} totalSteps={TOTAL_STEPS} />
        <HealthProgress width={progressWidth} />

        <Animated.View className="flex-1" style={{ opacity, transform: [{ translateX }] }}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              gap: 24,
              paddingBottom: 24,
              paddingHorizontal: 20,
              paddingTop: 24,
            }}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 ? (
              <BasicHealthProfileStep
                dateOfBirth={dateOfBirth}
                fullName={fullName}
                gender={gender}
                height={height}
                setDateOfBirth={setDateOfBirth}
                setFullName={setFullName}
                setGender={setGender}
                setHeight={setHeight}
                setWeight={setWeight}
                weight={weight}
              />
            ) : null}

            {step === 1 ? (
              <HealthGoalsStep goal={selectedGoal} setGoal={setSelectedGoal} />
            ) : null}

            {step === 2 ? (
              <DietPreferenceStep
                diet={selectedDiet}
                noDiet={noDiet}
                setDiet={(id) => {
                  setSelectedDiet(id);
                  setNoDiet(false);
                }}
              />
            ) : null}

            {step === 3 ? (
              <MedicalConditionsStep
                allergyText={allergyText}
                selectedConditions={selectedConditions}
                setAllergyText={setAllergyText}
                setSelectedConditions={setSelectedConditions}
              />
            ) : null}
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
                setSelectedDiet('');
                setNoDiet(true);
                animateTo(3);
              }}
            >
              Tôi không theo chế độ ăn nào.
            </HealthSecondaryButton>
          ) : null}
          {step === 3 ? (
            <HealthSecondaryButton
              onPress={() => {
                setSelectedConditions([]);
              }}
            >
              Tôi không có bệnh lý nào.
            </HealthSecondaryButton>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}