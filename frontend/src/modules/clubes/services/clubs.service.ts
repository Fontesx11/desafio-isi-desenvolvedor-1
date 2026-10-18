import { api } from '@/shared/api/api';
import type {
  Club,
  ClubDetails,
  ClubSort,
  CreateClub,
} from '../types/clubs.types';

export const getClubs = async (sort: ClubSort) => {
  const { data } = await api.get<Club[]>('/clubs', { params: { sort } });
  return data;
};

export const getClub = async (id: number) => {
  const { data } = await api.get<ClubDetails>(`/clubs/${id}`);
  return data;
};

export const saveClub = async (club: CreateClub) => {
  const { data } = await api.post<Club>('/clubs', club);
  return data;
};
