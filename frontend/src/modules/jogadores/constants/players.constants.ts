import type {
  PlayerAttributes,
  PlayerCondition,
  PlayerPosition,
} from '../types/players.types';

export const PAGE_SIZE = 10;

export const POSITIONS = [
  'GOL',
  'ZAG',
  'LAT',
  'MEI',
  'ATA',
] as const satisfies readonly PlayerPosition[];

export const POSITION_LABELS: Record<PlayerPosition, string> = {
  GOL: 'Goleiro',
  ZAG: 'Zagueiro',
  LAT: 'Lateral',
  MEI: 'Meio-campo',
  ATA: 'Atacante',
};

export const CONDITIONS = [
  'APTO',
  'MAL_CONDICIONADO',
  'DOENTE',
] as const satisfies readonly PlayerCondition[];

export const CONDITION_LABELS: Record<PlayerCondition, string> = {
  APTO: 'Apto',
  MAL_CONDICIONADO: 'Mal condicionado',
  DOENTE: 'Doente',
};

export const CONDITION_DESCRIPTIONS: Record<PlayerCondition, string> = {
  APTO: 'Sem desconto por condição.',
  MAL_CONDICIONADO:
    'Desconto de 15%. Agilidade de 80 a 100 corta pela metade; de 1 a 30 soma 10 pontos.',
  DOENTE: 'Desconto de 30%, com o mesmo ajuste de agilidade.',
};

export const ATTRIBUTES: { key: keyof PlayerAttributes; label: string }[] = [
  { key: 'pace', label: 'Velocidade' },
  { key: 'shooting', label: 'Finalização' },
  { key: 'passing', label: 'Passe' },
  { key: 'dribbling', label: 'Drible' },
  { key: 'defending', label: 'Defesa' },
  { key: 'physical', label: 'Físico' },
];

export const SORT_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'value_desc', label: 'Maior valor de mercado' },
  { value: 'value_asc', label: 'Menor valor de mercado' },
  { value: 'age_desc', label: 'Maior idade' },
  { value: 'age_asc', label: 'Menor idade' },
  { value: 'position', label: 'Posição (GOL a ATA)' },
];

export const AGE_RANGE = { min: 16, max: 45 };
export const MARKET_VALUE_RANGE = { min: 0, max: 550 };
