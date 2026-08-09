import { useQuery } from '@tanstack/react-query';

import { homeApi } from '@/features/home/api/home.api';
import { homeKeys } from '@/features/home/api/home.keys';
import { getLocalDateKey, resolveMealPeriod } from '@/features/home/meal-period';
import type { HomeProfileContext } from '@/features/home/home.types';

export function useHomeSnapshot(profile: HomeProfileContext, now: Date) {
  return useQuery({
    queryFn: ({ signal }) => homeApi.getSnapshot({ now, profile, signal }),
    queryKey: homeKeys.snapshot(getLocalDateKey(now), resolveMealPeriod(now)),
  });
}
