import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  buyPlayer,
  deletePlayer,
  getPlayers,
  savePlayer,
  updatePlayer,
  updatePlayerCondition,
} from '../services/players.service';
import type {
  BuyPlayer,
  CreatePlayer,
  UpdatePlayer,
  UpdatePlayerCondition,
} from '../types/players.types';

export function usePlayersQueries() {
  const queryClient = useQueryClient();

  const refreshPlayers = () =>
    queryClient.invalidateQueries({ queryKey: ['players'] });

  const showError = (error: Error) => toast.error(error.message);

  const useGetPlayers = (queryParams = '') =>
    useQuery({
      queryKey: ['players', queryParams],
      queryFn: () => getPlayers(queryParams),
    });

  const useGetPlayersTotal = () => {
    const { data } = useGetPlayers('limit=1');
    return data?.meta.total_items ?? 0;
  };

  const useCreatePlayer = () =>
    useMutation({
      mutationFn: (data: CreatePlayer) => savePlayer(data),
      onSuccess: refreshPlayers,
      onError: showError,
    });

  const useUpdatePlayer = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdatePlayer }) =>
        updatePlayer(id, data),
      onSuccess: refreshPlayers,
      onError: showError,
    });

  const useUpdatePlayerCondition = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdatePlayerCondition }) =>
        updatePlayerCondition(id, data),
      onSuccess: refreshPlayers,
      onError: showError,
    });

  const useDeletePlayer = () =>
    useMutation({
      mutationFn: (id: number) => deletePlayer(id),
      onSuccess: refreshPlayers,
      onError: showError,
    });

  const useBuyPlayer = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: BuyPlayer }) =>
        buyPlayer(id, data),
      onSuccess: () => {
        refreshPlayers();
        queryClient.invalidateQueries({ queryKey: ['clubs'] });
      },
      onError: showError,
    });

  return {
    useGetPlayers,
    useGetPlayersTotal,
    useCreatePlayer,
    useUpdatePlayer,
    useUpdatePlayerCondition,
    useDeletePlayer,
    useBuyPlayer,
  };
}
