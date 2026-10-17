import { ContractSummary } from '../../contratos/interfaces/contract.interface.js';
import { PlayerWithDynamicValues } from '../../jogadores/interfaces/player.interface.js';
import { Club } from '../entities/club.entity.js';

export interface ClubWithDynamicValues extends Club {
  squad: PlayerWithDynamicValues[];
  squadValue: number;
  netWorth: number;
}

export interface SquadPlayer {
  player: PlayerWithDynamicValues;
  contract: ContractSummary | null;
}

export interface ClubDetails {
  club: ClubWithDynamicValues;
  squad: SquadPlayer[];
}
