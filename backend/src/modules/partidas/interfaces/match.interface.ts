import { MatchDuel } from '../entities/match-duel.entity.js';
import { Match } from '../entities/match.entity.js';
import { MatchResult } from '../enums/matches.enum.js';

export type CreateMatchData = Omit<Match, 'id' | 'playedAt' | 'homeClub' | 'awayClub'>;

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
