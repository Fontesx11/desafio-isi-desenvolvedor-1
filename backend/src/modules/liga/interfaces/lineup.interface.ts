import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { PlayerResponseDto } from '../../jogadores/dtos/player-response.dto.js';
import { PlayerWithDynamicValues } from '../../jogadores/interfaces/player.interface.js';

export interface ClubLineup {
  clubId: number;
  formation: ClubFormation | null;
  complete: boolean;
  players: PlayerWithDynamicValues[];
}

export interface FormationSectors {
  defense: number;
  midfield: number;
  attack: number;
}

export interface ClubLineupResponse {
  club_id: number;
  formation: ClubFormation | null;
  complete: boolean;
  players: PlayerResponseDto[];
}
