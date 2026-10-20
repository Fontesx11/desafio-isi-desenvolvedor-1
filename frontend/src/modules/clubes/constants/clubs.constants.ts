import type { PlayerPosition } from '@/modules/jogadores/types/players.types';
import type { TransactionType } from '@/modules/mercado/types/market.types';
import type { ClubSort, Formation, LineupSector } from '../types/clubs.types';

export const SORT_OPTIONS: { value: ClubSort; label: string }[] = [
  { value: 'name', label: 'Nome' },
  { value: 'net_worth_desc', label: 'Patrimônio (maior para o menor)' },
  { value: 'net_worth_asc', label: 'Patrimônio (menor para o maior)' },
];

export const FORMATION_VALUES = [
  '3-1',
  '2-2',
  '2-1-1',
  '1-2-1',
] as const satisfies readonly Formation[];

export const FORMATIONS: {
  value: Formation;
  description: string;
  slots: LineupSector[];
}[] = [
  {
    value: '3-1',
    description: 'Defesa 3, ataque 1',
    slots: ['goalkeeper', 'defense', 'defense', 'defense', 'attack'],
  },
  {
    value: '2-2',
    description: 'Defesa 2, ataque 2',
    slots: ['goalkeeper', 'defense', 'defense', 'attack', 'attack'],
  },
  {
    value: '2-1-1',
    description: 'Defesa 2, meio 1, ataque 1',
    slots: ['goalkeeper', 'defense', 'defense', 'midfield', 'attack'],
  },
  {
    value: '1-2-1',
    description: 'Defesa 1, meio 2, ataque 1',
    slots: ['goalkeeper', 'defense', 'midfield', 'midfield', 'attack'],
  },
];

export const LINEUP_SECTORS: Record<
  LineupSector,
  { label: string; positions: PlayerPosition[] }
> = {
  goalkeeper: { label: 'Goleiro', positions: ['GOL'] },
  defense: { label: 'Defesa', positions: ['ZAG', 'LAT'] },
  midfield: { label: 'Meio', positions: ['MEI'] },
  attack: { label: 'Ataque', positions: ['ATA'] },
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  COMPRA: 'Compra',
  VENDA: 'Venda',
};
