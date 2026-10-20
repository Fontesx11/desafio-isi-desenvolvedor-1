import { api } from '@/shared/api/api';
import type { CreateMatch, Match } from '../types/matches.types';

export const saveMatch = async (match: CreateMatch) => {
  const { data } = await api.post<Match>('/matches', match);
  return data;
};
