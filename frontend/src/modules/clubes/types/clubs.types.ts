import type { Player } from '@/modules/jogadores/types/players.types';

export type Club = {
  id: number;
  name: string;
  acronym: string;
  cash: number;
  squad_value: number;
  net_worth: number;
};

export type CreateClub = Pick<Club, 'name' | 'acronym'>;

export type PlayerContract = {
  purchase_value: number;
  loyalty_until: string;
  remaining_days: number;
  penalty_rate: number;
};

export type SquadPlayer = Player & { contract: PlayerContract };

export type ClubDetails = Club & { players: SquadPlayer[] };

export type ClubSort = 'name' | 'net_worth_desc' | 'net_worth_asc';

export type Formation = '3-1' | '2-2' | '2-1-1' | '1-2-1';
