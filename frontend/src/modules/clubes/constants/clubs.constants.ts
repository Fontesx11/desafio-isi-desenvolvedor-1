import type { TransactionType } from '@/modules/mercado/types/market.types';
import type { ClubSort, Formation } from '../types/clubs.types';

export const SORT_OPTIONS: { value: ClubSort; label: string }[] = [
  { value: 'name', label: 'Nome' },
  { value: 'net_worth_desc', label: 'Patrimônio (maior para o menor)' },
  { value: 'net_worth_asc', label: 'Patrimônio (menor para o maior)' },
];

export const FORMATIONS: { value: Formation; description: string }[] = [
  { value: '3-1', description: 'Defesa 3, ataque 1' },
  { value: '2-2', description: 'Defesa 2, ataque 2' },
  { value: '2-1-1', description: 'Defesa 2, meio 1, ataque 1' },
  { value: '1-2-1', description: 'Defesa 1, meio 2, ataque 1' },
];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  COMPRA: 'Compra',
  VENDA: 'Venda',
};
