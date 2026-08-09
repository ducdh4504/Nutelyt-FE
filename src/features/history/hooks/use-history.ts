import { useQuery } from '@tanstack/react-query';

import { historyApi } from '@/features/history/api/history.api';
import { historyKeys } from '@/features/history/api/history.keys';

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function useHistory(now: Date) {
  return useQuery({
    queryFn: ({ signal }) => historyApi.getHistory({ now, signal }),
    queryKey: historyKeys.snapshot(getLocalDateKey(now)),
  });
}
