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

export type UpdatePlayer = Pick<
  CreatePlayer,
  'name' | 'position' | 'agility' | 'age'
>;

export type UpdatePlayerCondition = {
  condition: PlayerCondition;
};

export type CreatePlayer = {
  name: string;
  position: PlayerPosition;
  age: number;
  agility: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  potential: number;
};

export type PlayersTab = 'all' | 'free' | 'in-clubs';

export type PlayerAction = 'details' | 'edit' | 'condition' | 'delete' | 'buy';

export type Page<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
};
