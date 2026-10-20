import { api } from '@/shared/api/api';
import type { CreateMatch, Match } from '../types/matches.types';

export const getMatches = async (clubId?: number) => {
  const { data } = await api.get<Match[]>('/matches', {
    params: { club_id: clubId },
  });
  return data;
};

export const getMatch = async (id: number) => {
  const { data } = await api.get<Match>(`/matches/${id}`);
  return data;
};

export const saveMatch = async (match: CreateMatch) => {
  const { data } = await api.post<Match>('/matches', match);
  return data;
};
