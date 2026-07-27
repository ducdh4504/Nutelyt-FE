import { Stack } from 'expo-router';

import { ScanCameraScreen } from '@/features/food-analysis';

export default function ScanRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScanCameraScreen />
    </>
  );
}
