import { Redirect, Stack, useLocalSearchParams, type Href } from 'expo-router';

import type { RouteProfileParams } from '@/src/features/main/types';

export default function LegacyHistoryRedirect() {
  const params = useLocalSearchParams<RouteProfileParams>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect href={{ pathname: '/history', params } as unknown as Href} />
    </>
  );
}
