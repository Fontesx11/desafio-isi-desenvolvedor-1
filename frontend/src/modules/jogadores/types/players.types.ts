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

export type PlayerAction = 'details' | 'edit' | 'condition' | 'delete' | 'buy';

// Mesmo formato da resposta de POST /players/{id}/buy
export type PurchaseResult = {
  id: number;
  club_id: number;
  player_id: number;
  player_name: string;
  type: 'COMPRA';
  value: number;
  fee: number;
  penalty: number;
  profit: number | null;
  cash_change: number;
  created_at: string;
  contract: {
    purchase_value: number;
    loyalty_until: string;
    status: 'ATIVO';
  };
  club_cash: number;
};
