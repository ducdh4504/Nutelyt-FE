import { Stack } from 'expo-router';

import { HealthProfileFlowScreen } from '@/features/health-profile';

export default function HealthProfileRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HealthProfileFlowScreen />
    </>
  );
}