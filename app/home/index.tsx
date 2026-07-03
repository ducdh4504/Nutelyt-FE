import { Stack } from 'expo-router';

import { HomeScreen } from '@/src/features/main';

export default function HomeRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  );
}
