import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { StreakInfo, Badge } from '@/backend';

export function useGetCurrentStreak() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: ['currentStreak'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const streak = await actor.getCurrentStreak();
      return Number(streak);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetLastStreakCompletionDate() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<number>({
    queryKey: ['lastStreakCompletionDate'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const date = await actor.getLastStreakCompletionDate();
      return Number(date);
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetUserBadges() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Badge[]>({
    queryKey: ['userBadges'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserBadges();
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useUpdateStreakAndAward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hasCompletedTestToday: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStreakAndAward(hasCompletedTestToday);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentStreak'] });
      queryClient.invalidateQueries({ queryKey: ['lastStreakCompletionDate'] });
      queryClient.invalidateQueries({ queryKey: ['userBadges'] });
    },
  });
}
