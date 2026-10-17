import { Player } from '../entities/player.entity.js';

export interface PlayerWithDynamicValues extends Player {
  overall: number;
  marketValue: number;
}
