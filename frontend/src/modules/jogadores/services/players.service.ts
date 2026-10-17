import { api } from '@/shared/api/api';
import type {
  CreatePlayer,
  Page,
  Player,
  UpdatePlayer,
  UpdatePlayerCondition,
} from '../types/players.types';

export const getPlayers = async (queryParams = '') =>
  (await api.get<Page<Player>>(`/players?${queryParams}`)).data;

export const savePlayer = async (data: CreatePlayer) =>
  (await api.post<Player>('/players', data)).data;

export const updatePlayer = async (id: number, data: UpdatePlayer) =>
  (await api.put<Player>(`/players/${id}`, data)).data;

export const updatePlayerCondition = async (
  id: number,
  data: UpdatePlayerCondition,
) => (await api.patch<Player>(`/players/${id}/condition`, data)).data;

export const deletePlayer = async (id: number) => {
  await api.delete(`/players/${id}`);
};
