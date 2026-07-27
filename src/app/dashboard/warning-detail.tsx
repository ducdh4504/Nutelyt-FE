import { Stack } from 'expo-router';

import { DashboardWarningDetailScreen } from '@/features/dashboard';

export default function DashboardWarningDetailRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DashboardWarningDetailScreen />
    </>
  );
}
