import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getLineup, saveLineup } from '../services/league.service';
import type { SaveLineup } from '../types/league.types';

export function useLeagueQueries() {
  const queryClient = useQueryClient();

  const refreshLineup = () =>
    queryClient.invalidateQueries({ queryKey: ['lineup'] });

  const showError = (error: Error) => toast.error(error.message);

  const useGetLineup = (clubId: number) =>
    useQuery({
      queryKey: ['lineup', clubId],
      queryFn: () => getLineup(clubId),
    });

  const useSaveLineup = () =>
    useMutation({
      mutationFn: ({ clubId, data }: { clubId: number; data: SaveLineup }) =>
        saveLineup(clubId, data),
      onSuccess: refreshLineup,
      onError: showError,
    });

  return { useGetLineup, useSaveLineup };
}
