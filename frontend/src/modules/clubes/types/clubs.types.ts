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

export type SaleResult = {
  id: number;
  club_id: number;
  player_id: number;
  player_name: string;
  type: 'VENDA';
  value: number;
  fee: number;
  penalty: number;
  profit: number;
  cash_change: number;
  created_at: string;
  purchase_value: number;
  remaining_days: number;
  penalty_rate: number;
  contract_status: 'RESCINDIDO' | 'ENCERRADO';
  club_cash: number;
};

export type TransactionType = 'COMPRA' | 'VENDA';

export type Transaction = {
  id: number;
  club_id: number;
  player_id: number;
  player_name: string;
  type: TransactionType;
  value: number;
  fee: number;
  penalty: number;
  profit: number | null;
  cash_change: number;
  created_at: string;
};

export type TransactionsSummary = {
  total_spent: number;
  total_received: number;
  total_fees: number;
  total_penalties: number;
  total_profit: number;
};
