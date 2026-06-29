import { Stack } from 'expo-router';

import { DashboardScreen } from '@/src/features/main';

export default function DashboardRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DashboardScreen />
    </>
  );
}
