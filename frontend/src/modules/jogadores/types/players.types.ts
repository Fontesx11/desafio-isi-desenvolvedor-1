export type PlayerPosition = 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA';

export type PlayerCondition = 'APTO' | 'MAL_CONDICIONADO' | 'DOENTE';

export type PlayerAttributes = {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
};

// Mesmo formato da resposta de GET /players
export type Player = PlayerAttributes & {
  id: number;
  name: string;
  position: PlayerPosition;
  agility: number;
  age: number;
  condition: PlayerCondition;
  base_value: number;
  market_value: number;
  potential: number;
  overall: number;
  club_id: number | null;
};

export type PlayersTab = 'all' | 'free' | 'in-clubs';

// A compra fica para a etapa de Compra; aqui só as ações do jogador
export type PlayerAction = 'details' | 'edit' | 'condition' | 'delete';
