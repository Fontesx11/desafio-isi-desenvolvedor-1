import { Player } from '../entities/player.entity.js';
import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';

export type PlayerWithDynamicValues = Player & {
  overall: number;
  marketValue: number;
};

export class PlayerResponseDto {
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

  constructor(player: PlayerWithDynamicValues) {
    this.id = player.id;
    this.name = player.name;
    this.position = player.position;
    this.agility = player.agility;
    this.age = player.age;
    this.condition = player.condition;
    this.base_value = Number(player.baseValue);
    this.market_value = player.marketValue;
    this.pace = player.pace;
    this.shooting = player.shooting;
    this.passing = player.passing;
    this.dribbling = player.dribbling;
    this.defending = player.defending;
    this.physical = player.physical;
    this.potential = player.potential;
    this.overall = player.overall;
    this.club_id = player.clubId;
  }
}
