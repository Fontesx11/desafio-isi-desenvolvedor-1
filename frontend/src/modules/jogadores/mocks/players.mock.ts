import type { Player } from '../types/players.types';

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
