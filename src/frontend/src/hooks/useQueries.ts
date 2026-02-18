import { useQuery } from '@tanstack/react-query';
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
      // Pass empty string for apiKey as backend uses integrations
      return actor.getNews(regionId, '');
    },
    enabled: !!actor && !isFetching && shouldFetch,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
