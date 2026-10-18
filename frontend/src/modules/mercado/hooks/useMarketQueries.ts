import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { buyPlayer, sellPlayer } from '../services/market.service';
import type { BuyPlayer } from '../types/market.types';

export function useMarketQueries() {
  const queryClient = useQueryClient();

  const refreshPlayersAndClubs = () => {
    queryClient.invalidateQueries({ queryKey: ['players'] });
    queryClient.invalidateQueries({ queryKey: ['clubs'] });
  };

  const showError = (error: Error) => toast.error(error.message);

  const useBuyPlayer = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: BuyPlayer }) =>
        buyPlayer(id, data),
      onSuccess: refreshPlayersAndClubs,
      onError: showError,
    });

  const useSellPlayer = () =>
    useMutation({
      mutationFn: (id: number) => sellPlayer(id),
      onSuccess: refreshPlayersAndClubs,
      onError: showError,
    });

  return { useBuyPlayer, useSellPlayer };
}
