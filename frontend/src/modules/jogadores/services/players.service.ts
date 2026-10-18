import { api } from '@/shared/api/api';
import type {
  CreatePlayer,
  Page,
  Player,
  UpdatePlayer,
  UpdatePlayerCondition,
} from '../types/players.types';

export const getPlayers = async (queryParams = '') => {
  const { data } = await api.get<Page<Player>>(`/players?${queryParams}`);
  return data;
};

export const savePlayer = async (player: CreatePlayer) => {
  const { data } = await api.post<Player>('/players', player);
  return data;
};

export const updatePlayer = async (id: number, player: UpdatePlayer) => {
  const { data } = await api.put<Player>(`/players/${id}`, player);
  return data;
};

export const updatePlayerCondition = async (
  id: number,
  condition: UpdatePlayerCondition,
) => {
  const { data } = await api.patch<Player>(
    `/players/${id}/condition`,
    condition,
  );
  return data;
};

export const deletePlayer = async (id: number) => {
  await api.delete(`/players/${id}`);
};
