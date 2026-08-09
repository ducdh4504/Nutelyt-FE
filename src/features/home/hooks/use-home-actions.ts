import { useMutation, useQueryClient } from '@tanstack/react-query';

import { homeApi } from '@/features/home/api/home.api';
import { homeKeys } from '@/features/home/api/home.keys';

function useRefreshHome() {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: [...homeKeys.all, 'snapshot'] }),
    queryClient.invalidateQueries({ queryKey: ['history'] }),
  ]);
}

export function useHomeActions() {
  const refreshHome = useRefreshHome();
  const save = useMutation({
    mutationFn: homeApi.saveRecommendation,
    onSuccess: refreshHome,
  });
  const unsave = useMutation({
    mutationFn: homeApi.unsaveRecommendation,
    onSuccess: refreshHome,
  });
  const logMeal = useMutation({
    mutationFn: homeApi.logMeal,
    onSuccess: refreshHome,
  });
  const logActivity = useMutation({
    mutationFn: homeApi.logActivity,
    onSuccess: refreshHome,
  });
  return { logActivity, logMeal, save, unsave };
}
