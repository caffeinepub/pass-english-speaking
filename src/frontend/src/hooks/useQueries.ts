import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { isDemoMode } from '@/config/newsDataSource';

export function useRegionNews(regionId: string, enabled: boolean = true) {
  const { actor, isFetching } = useActor();

  // In demo mode, disable backend queries
  const shouldFetch = !isDemoMode() && enabled;

  return useQuery<string>({
    queryKey: ['news', regionId],
    queryFn: async () => {
      if (!actor) return '';
      
      // Call the appropriate backend method based on region
      if (regionId === 'india') {
        return await actor.getIndiaNews();
      }
      
      // For other regions, return empty for now (backend doesn't support them yet)
      // This allows the UI to show empty state instead of being blocked
      return '';
    },
    enabled: !!actor && !isFetching && shouldFetch,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useRefreshRegionNews(regionId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      if (regionId === 'india') {
        return await actor.forceRefreshIndiaNews();
      }
      
      // For other regions, return empty
      return '';
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news', regionId] });
    },
  });
}
