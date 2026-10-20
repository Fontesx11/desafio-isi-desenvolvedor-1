import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMatch, getMatches, saveMatch } from '../services/matches.service';
import type { CreateMatch } from '../types/matches.types';

export function useMatchesQueries() {
  const queryClient = useQueryClient();

  const refreshMatches = () => {
    queryClient.invalidateQueries({ queryKey: ['matches'] });
    queryClient.invalidateQueries({ queryKey: ['standings'] });
  };

  const showError = (error: Error) => toast.error(error.message);

  const useGetMatches = (clubId?: number) =>
    useQuery({
      queryKey: ['matches', { clubId }],
      queryFn: () => getMatches(clubId),
    });

  const useGetMatch = (id: number) =>
    useQuery({
      queryKey: ['matches', id],
      queryFn: () => getMatch(id),
    });

  const useCreateMatch = () =>
    useMutation({
      mutationFn: (data: CreateMatch) => saveMatch(data),
      onSuccess: refreshMatches,
      onError: showError,
    });

  return { useGetMatches, useGetMatch, useCreateMatch };
}
