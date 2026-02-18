import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { WordEntry } from '@/backend';

export function useGetWordBank() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WordEntry[]>({
    queryKey: ['wordBank'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWordBank();
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useSaveWord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ word, meaning }: { word: string; meaning: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Please log in to save words');
      return actor.saveWord(word, meaning);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordBank'] });
    },
  });
}

export function useRemoveWord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (word: string) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Please log in to remove words');
      return actor.removeWord(word);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordBank'] });
    },
  });
}
