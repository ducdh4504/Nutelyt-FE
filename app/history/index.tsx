import { Stack } from 'expo-router';

import { HistoryScreen } from '@/src/features/main';

export default function HistoryRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HistoryScreen />
    </>
  );
}
