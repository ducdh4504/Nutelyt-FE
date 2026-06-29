import { Stack } from 'expo-router';

import { ScanCameraScreen } from '@/src/features/main';

export default function ScanRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScanCameraScreen />
    </>
  );
}
