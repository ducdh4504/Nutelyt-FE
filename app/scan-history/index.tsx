import { Stack } from 'expo-router';

import { ScanHistoryScreen } from '@/src/features/main';

export default function ScanHistoryRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScanHistoryScreen />
    </>
  );
}
