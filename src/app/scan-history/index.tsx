import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { routes } from '@/config/routes';
import type { RouteProfileParams } from '@/features/profile/profile.types';

export default function LegacyHistoryRedirect() {
  const params = useLocalSearchParams<RouteProfileParams>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect href={{ pathname: routes.history, params }} />
    </>
  );
}
