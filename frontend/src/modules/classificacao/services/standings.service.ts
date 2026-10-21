import { api } from '@/shared/api/api';
import type { Standing } from '../types/standings.types';

export const getStandings = async () => {
  const { data } = await api.get<Standing[]>('/standings');
  return data;
};
