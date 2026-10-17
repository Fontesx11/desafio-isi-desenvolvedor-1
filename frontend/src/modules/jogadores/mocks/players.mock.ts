import type { Player, PurchaseResult } from '../types/players.types';

type MockRow = [
  id: number,
  name: string,
  position: Player['position'],
  agility: number,
  age: number,
  condition: Player['condition'],
  baseValue: number,
  marketValue: number,
  attributes: [number, number, number, number, number, number],
  potential: number,
  overall: number,
  clubId: number | null,
];

export function toPlayer([
  id,
  name,
  position,
  agility,
  age,
  condition,
  baseValue,
  marketValue,
  [pace, shooting, passing, dribbling, defending, physical],
  potential,
  overall,
  clubId,
]: MockRow): Player {
  return {
    id,
    name,
    position,
    agility,
    age,
    condition,
    base_value: baseValue,
    market_value: marketValue,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
    potential,
    overall,
    club_id: clubId,
  };
}

export const PURCHASE_RESULT_MOCK: PurchaseResult = {
  id: 11,
  club_id: 6,
  player_id: 5,
  player_name: 'Eduardo Paiva',
  type: 'COMPRA',
  value: 46,
  fee: 2.3,
  penalty: 0,
  profit: null,
  cash_change: -48.3,
  created_at: '2026-11-12T15:00:00-03:00',
  contract: {
    purchase_value: 46,
    loyalty_until: '2027-11-12T15:00:00-03:00',
    status: 'ATIVO',
  },
  club_cash: 251.7,
};

// simulacao
// Custo total do mockup; de onde ele sai será decidido ao ligar a API
export const PURCHASE_TOTAL_COST_MOCK = 48.3;
