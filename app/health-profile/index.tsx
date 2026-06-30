import { Stack } from 'expo-router';

import { HealthProfileFlowScreen } from '@/src/features/health-profile';

export default function HealthProfileRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HealthProfileFlowScreen />
    </>
  );
}