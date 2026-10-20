import { api } from '@/shared/api/api';
import type { Lineup, SaveLineup } from '../types/league.types';

export const getLineup = async (clubId: number) => {
  const { data } = await api.get<Lineup>(`/clubs/${clubId}/lineup`);
  return data;
};

export const saveLineup = async (clubId: number, lineup: SaveLineup) => {
  const { data } = await api.put<Lineup>(`/clubs/${clubId}/lineup`, lineup);
  return data;
};
