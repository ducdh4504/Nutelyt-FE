import { Stack } from 'expo-router';

import { AnalysisResultScreen } from '@/src/features/main';

export default function AnalysisResultRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AnalysisResultScreen />
    </>
  );
}
