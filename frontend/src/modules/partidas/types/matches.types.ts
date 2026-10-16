import type {
  PlayerCondition,
  PlayerPosition,
} from '@/modules/jogadores/types/players.types';

export type MatchResult = 'MANDANTE' | 'VISITANTE' | 'EMPATE';

export type MatchSide = {
  club_id: number;
  club_name: string;
  formation: string;
  goals: number;
};

export type DuelAttribute = 'shooting' | 'passing' | 'dribbling' | 'defending';

export type DuelPlayer = {
  player_id: number;
  player_name: string;
  position: PlayerPosition;
  condition: PlayerCondition;
  attribute: DuelAttribute;
  value: number;
};

export type Duel = {
  order: number;
  attacking_club_id: number;
  attacker: DuelPlayer;
  defender: DuelPlayer;
  goal: boolean;
};

export type Match = {
  id: number;
  played_at: string;
  home: MatchSide;
  away: MatchSide;
  result: MatchResult;
  duels?: Duel[];
};
