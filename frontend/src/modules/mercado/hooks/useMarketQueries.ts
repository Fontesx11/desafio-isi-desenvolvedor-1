import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  buyPlayer,
  exportTransactions,
  getTransactions,
  sellPlayer,
} from '../services/market.service';
import type { BuyPlayer } from '../types/market.types';

export function useMarketQueries() {
  const queryClient = useQueryClient();

  const refreshAfterTrade = () => {
    queryClient.invalidateQueries({ queryKey: ['players'] });
    queryClient.invalidateQueries({ queryKey: ['clubs'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['lineup'] });
  };

  const showError = (error: Error) => toast.error(error.message);

  const useGetTransactions = (clubId: number, queryParams = '') =>
    useQuery({
      queryKey: ['transactions', clubId, queryParams],
      queryFn: () => getTransactions(clubId, queryParams),
    });

  const useExportTransactions = () =>
    useMutation({
      mutationFn: ({
        clubId,
        queryParams,
      }: {
        clubId: number;
        queryParams: string;
      }) => exportTransactions(clubId, queryParams),
      onError: showError,
    });

  const useBuyPlayer = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: BuyPlayer }) =>
        buyPlayer(id, data),
      onSuccess: refreshAfterTrade,
      onError: showError,
    });

  const useSellPlayer = () =>
    useMutation({
      mutationFn: (id: number) => sellPlayer(id),
      onSuccess: refreshAfterTrade,
      onError: showError,
    });

  return {
    useGetTransactions,
    useExportTransactions,
    useBuyPlayer,
    useSellPlayer,
  };
}
