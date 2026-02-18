import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUSNews() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['news', 'us_general'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getNews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useRefreshUSNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.forceRefreshNews();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', 'us_general'] });
    },
  });
}
