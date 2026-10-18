import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { MatchDuel } from '../entities/match-duel.entity.js';
import { MatchResult } from '../enums/matches.enum.js';
import {
  DuelPlayerResponse,
  MatchClubResponse,
  MatchDetails,
} from '../interfaces/match.interface.js';

export class MatchDuelResponseDto {
  order: number;
  attacking_club_id: number;
  attacker: DuelPlayerResponse;
  defender: DuelPlayerResponse;
  goal: boolean;

  constructor(duel: MatchDuel) {
    this.order = duel.order;
    this.attacking_club_id = duel.attackingClubId;
    this.attacker = {
      player_id: duel.attackerId,
      player_name: duel.attackerName,
      position: duel.attackerPosition,
      condition: duel.attackerCondition,
      attribute: duel.attackAttribute,
      value: duel.attackValue,
    };
    this.defender = {
      player_id: duel.defenderId,
      player_name: duel.defenderName,
      position: duel.defenderPosition,
      condition: duel.defenderCondition,
      attribute: duel.defenseAttribute,
      value: duel.defenseValue,
    };
    this.goal = duel.goal;
  }
}

export class MatchResponseDto {
  id: number;
  played_at: string;
  home: MatchClubResponse;
  away: MatchClubResponse;
  result: MatchResult;
  duels: MatchDuelResponseDto[];

  constructor({ match, result, duels }: MatchDetails) {
    this.id = match.id;
    this.played_at = formatBrasiliaDateTime(match.playedAt);
    this.home = {
      club_id: match.homeClubId,
      club_name: match.homeClub.name,
      formation: match.homeFormation,
      goals: match.homeGoals,
    };
    this.away = {
      club_id: match.awayClubId,
      club_name: match.awayClub.name,
      formation: match.awayFormation,
      goals: match.awayGoals,
    };
    this.result = result;
    this.duels = duels.map((duel) => new MatchDuelResponseDto(duel));
  }
}
