import type { Formation } from '@/modules/clubes/types/clubs.types';
import type { Player } from '@/modules/jogadores/types/players.types';

export type Lineup = {
  club_id: number;
  formation: Formation | null;
  complete: boolean;
  players: Player[];
};

export type SaveLineup = {
  formation: Formation;
  player_ids: number[];
};
