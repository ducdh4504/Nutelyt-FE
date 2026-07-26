import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { routes } from '@/src/config/routes';
import type { RouteProfileParams } from '@/src/features/main/types';

export default function LegacyHistoryRedirect() {
  const params = useLocalSearchParams<RouteProfileParams>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect href={{ pathname: routes.history, params }} />
    </>
  );
}
