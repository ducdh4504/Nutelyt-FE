import { Stack } from 'expo-router';

import { DashboardWarningDetailScreen } from '@/src/features/dashboard';

export default function DashboardWarningDetailRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DashboardWarningDetailScreen />
    </>
  );
}
