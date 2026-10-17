import { api } from '@/shared/api/api';
import type { Club } from '../types/clubs.types';

export const getClubs = async () => (await api.get<Club[]>('/clubs')).data;
