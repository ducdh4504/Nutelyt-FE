import { Stack } from 'expo-router';

import { AnalysisResultScreen } from '@/src/features/food-analysis';

export default function AnalysisResultRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AnalysisResultScreen />
    </>
  );
}
