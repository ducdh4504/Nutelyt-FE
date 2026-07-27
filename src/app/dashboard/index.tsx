import { Stack } from 'expo-router';

import { DashboardScreen } from '@/features/dashboard';

export default function DashboardRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DashboardScreen />
    </>
  );
}
