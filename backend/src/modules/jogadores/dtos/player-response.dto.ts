import { Player } from '../entities/player.entity.js';
import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';
import { calculateMarketValueCents, calculateOverall } from '../utils/players.calculations.js';


export interface PlayerResponseDto {
  id: number;
  name: string;
  position: PlayerPosition;
  agility: number;
  age: number;
  condition: PlayerCondition;
  base_value: number;
  market_value: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  potential: number;
  overall: number;
  club_id: number | null;
}

export function toPlayerResponse(player: Player): PlayerResponseDto {
  const baseValueCents = Math.round(Number(player.baseValue) * 100);
  const marketValueCents = calculateMarketValueCents(
    baseValueCents,
    player.condition,
    player.agility,
    player.age,
  );

  return {
    id: player.id,
    name: player.name,
    position: player.position,
    agility: player.agility,
    age: player.age,
    condition: player.condition,
    base_value: baseValueCents / 100,
    market_value: marketValueCents / 100,
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical,
    potential: player.potential,
    overall: calculateOverall(player.position, player),
    club_id: player.clubId,
  };
}
