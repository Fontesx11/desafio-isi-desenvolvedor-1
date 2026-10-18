import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../../jogadores/enums/players.enum.js';
import { MatchDuel } from '../entities/match-duel.entity.js';
import { Match } from '../entities/match.entity.js';
import { DuelAttribute, MatchResult } from '../enums/matches.enum.js';

export type CreateMatchData = Omit<
  Match,
  'id' | 'playedAt' | 'homeClub' | 'awayClub'
>;

export type CreateMatchDuelData = Omit<MatchDuel, 'id' | 'matchId'>;

export interface DuelPair {
  attacker: number;
  defender: number;
}

export interface MatchSummary {
  match: Match;
  result: MatchResult;
}

export interface MatchDetails extends MatchSummary {
  duels: MatchDuel[];
}

export interface MatchClubResponse {
  club_id: number;
  club_name: string;
  formation: ClubFormation;
  goals: number;
}

export interface DuelPlayerResponse {
  player_id: number;
  player_name: string;
  position: PlayerPosition;
  condition: PlayerCondition;
  attribute: DuelAttribute;
  value: number;
}
