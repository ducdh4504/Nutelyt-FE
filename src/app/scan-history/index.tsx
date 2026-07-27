import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import { routes } from '@/config/routes';
import type { RouteProfileParams } from '@/types/navigation.types';

export default function LegacyHistoryRedirect() {
  const params = useLocalSearchParams<RouteProfileParams>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect href={{ pathname: routes.history, params }} />
    </>
  );
}
