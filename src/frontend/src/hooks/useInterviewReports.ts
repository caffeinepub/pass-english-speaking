import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InterviewAnalysis } from '@/backend';

export function useGetInterviewReports() {
  const { actor, isFetching } = useActor();

  return useQuery<InterviewAnalysis[]>({
    queryKey: ['interviewReports'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyProgressReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInterviewAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { question: string; answer: string; feedback: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addInterviewAnalysis(data.question, data.answer, data.feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewReports'] });
    },
  });
}
