import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { saveMatch } from '../services/matches.service';
import type { CreateMatch } from '../types/matches.types';

export function useMatchesQueries() {
  const queryClient = useQueryClient();

  const refreshMatches = () => {
    queryClient.invalidateQueries({ queryKey: ['matches'] });
    queryClient.invalidateQueries({ queryKey: ['standings'] });
  };

  const showError = (error: Error) => toast.error(error.message);

  const useCreateMatch = () =>
    useMutation({
      mutationFn: (data: CreateMatch) => saveMatch(data),
      onSuccess: refreshMatches,
      onError: showError,
    });

  return { useCreateMatch };
}
