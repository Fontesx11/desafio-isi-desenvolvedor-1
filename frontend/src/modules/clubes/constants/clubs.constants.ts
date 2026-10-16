import type { ClubSort } from '../types/clubs.types';

// Valores do query param sort de GET /clubs
export const SORT_OPTIONS: { value: ClubSort; label: string }[] = [
  { value: 'name', label: 'Nome' },
  { value: 'net_worth_desc', label: 'Patrimônio (maior para o menor)' },
  { value: 'net_worth_asc', label: 'Patrimônio (menor para o maior)' },
];
