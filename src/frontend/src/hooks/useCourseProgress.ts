import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '@/backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCourseProgress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<{ currentUnlockedDay: bigint; completedDays: bigint }>({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const [currentUnlockedDay, completedDays] = await actor.getCourseProgress(identity.getPrincipal());
      return { currentUnlockedDay, completedDays };
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetCompletedDaysCount() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: ['completedDaysCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const count = await actor.getCompletedDaysCount();
      return Number(count);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetUnlockedDaysCount() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: ['unlockedDaysCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const count = await actor.getUnlockedDaysCount();
      return Number(count);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSubmitTestScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.handleScore(score);
    },
    onSuccess: () => {
      // Invalidate all progress-related queries to refresh unlock state
      queryClient.invalidateQueries({ queryKey: ['courseProgress'] });
      queryClient.invalidateQueries({ queryKey: ['dayLocked'] });
      queryClient.invalidateQueries({ queryKey: ['dayUnlocked'] });
      queryClient.invalidateQueries({ queryKey: ['completedDays'] });
      queryClient.invalidateQueries({ queryKey: ['unlockedDays'] });
      queryClient.invalidateQueries({ queryKey: ['completedDaysCount'] });
      queryClient.invalidateQueries({ queryKey: ['unlockedDaysCount'] });
    },
  });
}

export function useIsDayLocked(day: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['dayLocked', day],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isDayLocked(BigInt(day));
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
