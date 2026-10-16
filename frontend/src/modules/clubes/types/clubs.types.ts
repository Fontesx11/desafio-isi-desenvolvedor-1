import type { Player } from '@/modules/jogadores/types/players.types';

// Mesmo formato da resposta de GET /clubs
export type Club = {
  id: number;
  name: string;
  acronym: string;
  cash: number;
  squad_value: number;
  net_worth: number;
};

// Contrato de cada jogador do elenco, calculado para uma venda agora
export type PlayerContract = {
  purchase_value: number;
  loyalty_until: string;
  remaining_days: number;
  penalty_rate: number;
};

export type SquadPlayer = Player & { contract: PlayerContract };

// Mesmo formato da resposta de GET /clubs/{id}
export type ClubDetails = Club & { players: SquadPlayer[] };

export type ClubSort = 'name' | 'net_worth_desc' | 'net_worth_asc';

export type Formation = '3-1' | '2-2' | '2-1-1' | '1-2-1';

// Mesmo formato da resposta de POST /players/{id}/sell
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

// Mesmo formato de cada item de GET /clubs/{id}/transactions
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

// Mesmo formato do summary de GET /clubs/{id}/transactions
export type TransactionsSummary = {
  total_spent: number;
  total_received: number;
  total_fees: number;
  total_penalties: number;
  total_profit: number;
};
