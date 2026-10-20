import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { roundDivision } from '../../core/utils/math.utils.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { Club } from '../clubes/entities/club.entity.js';
import { Player } from '../jogadores/entities/player.entity.js';
import { PlayerCondition, PlayerPosition } from '../jogadores/enums/players.enum.js';
import { ClubLineup } from '../liga/interfaces/lineup.interface.js';
import { LeagueService } from '../liga/league.service.js';
import { AWAY_FIRST_DUEL, DUEL_PAIRS, HOME_FIRST_DUEL, MAL_CONDICIONADO_PERCENT, POINTS_PER_DRAW, POINTS_PER_WIN } from './constants/matches.constants.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { ListMatchesQueryDto } from './dtos/list-matches-query.dto.js';
import { MatchDuel } from './entities/match-duel.entity.js';
import { Match } from './entities/match.entity.js';
import { DuelAttribute, MatchResult } from './enums/matches.enum.js';
import { CreateMatchData, CreateMatchDuelData, MatchDetails, MatchSummary } from './interfaces/match.interface.js';
import { ClubStanding, ClubStandingStats } from './interfaces/standing.interface.js';
import { sortStandings } from './utils/standings.sorting.js';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
    @InjectRepository(MatchDuel)
    private readonly matchDuelsRepository: Repository<MatchDuel>,
    private readonly dataSource: DataSource,
    private readonly clubsService: ClubsService,
    private readonly leagueService: LeagueService,
  ) {}

  async playMatch(dto: CreateMatchDto): Promise<MatchDetails> {
    const homeLineup = await this.leagueService.findLineup(dto.home_club_id);
    const awayLineup = await this.leagueService.findLineup(dto.away_club_id);

    if (!homeLineup.complete || !awayLineup.complete || homeLineup.formation === null || awayLineup.formation === null) {
      throw new ConflictException('os dois clubes devem ter a escalação completa, com os 5 titulares');
    }

    const homeAttacks = this.calculateAttacks(homeLineup, awayLineup, HOME_FIRST_DUEL);
    const awayAttacks = this.calculateAttacks(awayLineup, homeLineup, AWAY_FIRST_DUEL);

    const matchData: CreateMatchData = {
      homeClubId: homeLineup.clubId,
      awayClubId: awayLineup.clubId,
      homeGoals: homeAttacks.filter((duel) => duel.goal).length,
      awayGoals: awayAttacks.filter((duel) => duel.goal).length,
      homeFormation: homeLineup.formation,
      awayFormation: awayLineup.formation,
    };
    const duels = [...homeAttacks, ...awayAttacks];

    const matchId = await this.dataSource.transaction(async (manager) => {
      const match = await this.create(manager, matchData, duels);
      return match.id;
    });

    return this.findById(matchId);
  }

  calculateAttacks(attackingLineup: ClubLineup, defendingLineup: ClubLineup, firstOrder: number): CreateMatchDuelData[] {
    return DUEL_PAIRS.map((pair, index) => {
      const attacker = attackingLineup.players[pair.attacker];
      const defender = defendingLineup.players[pair.defender];
      const attackAttribute = this.getAttackAttribute(attacker.position);
      const attackValue = this.applyConditionPenalty(attacker, attacker[attackAttribute]);
      const defenseValue = this.applyConditionPenalty(defender, defender.defending);

      return {
        order: firstOrder + index,
        attackingClubId: attackingLineup.clubId,
        attackerId: attacker.id,
        attackerName: attacker.name,
        attackerPosition: attacker.position,
        attackerCondition: attacker.condition,
        attackAttribute,
        attackValue,
        defenderId: defender.id,
        defenderName: defender.name,
        defenderPosition: defender.position,
        defenderCondition: defender.condition,
        defenseAttribute: DuelAttribute.DEFENDING,
        defenseValue,
        goal: attackValue > defenseValue,
      };
    });
  }

  getAttackAttribute(position: PlayerPosition): DuelAttribute {
    if (position === PlayerPosition.ATA) {
      return DuelAttribute.SHOOTING;
    }

    if (position === PlayerPosition.MEI) {
      return DuelAttribute.PASSING;
    }

    return DuelAttribute.DRIBBLING;
  }

  applyConditionPenalty(player: Player, value: number): number {
    if (player.condition === PlayerCondition.MAL_CONDICIONADO) {
      return roundDivision(value * MAL_CONDICIONADO_PERCENT, 100);
    }

    return value;
  }

  async create(manager: EntityManager, data: CreateMatchData, duels: CreateMatchDuelData[]): Promise<Match> {
    const match = manager.create(Match, data);
    await manager.save(match);

    const matchDuels = duels.map((duel) => manager.create(MatchDuel, { ...duel, matchId: match.id }));

    await manager.save(matchDuels);

    return match;
  }

  async findById(id: number): Promise<MatchDetails> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: { homeClub: true, awayClub: true },
    });

    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    const duels = await this.matchDuelsRepository.find({
      where: { matchId: id },
      order: { order: 'ASC' },
    });

    return { match, result: this.calculateResult(match), duels };
  }

  async findAll(query: ListMatchesQueryDto): Promise<MatchSummary[]> {
    let conditions: FindOptionsWhere<Match>[] = [];

    if (query.club_id !== undefined) {
      const club = await this.clubsService.find({
        where: { id: query.club_id },
      });
      conditions = [{ homeClubId: club.id }, { awayClubId: club.id }];
    }

    const matches = await this.matchesRepository.find({
      where: conditions,
      relations: { homeClub: true, awayClub: true },
      order: { playedAt: 'DESC', id: 'DESC' },
    });

    return matches.map((match) => ({
      match,
      result: this.calculateResult(match),
    }));
  }

  async calculateStandings(): Promise<ClubStanding[]> {
    const clubs = await this.clubsService.find({ select: { id: true, name: true } }, 'many');
    const matches = await this.matchesRepository.find();
    const standings = clubs.map((club) => this.calculateClubStats(club, matches));

    return sortStandings(standings).map((stats, index) => ({
      ...stats,
      position: index + 1,
    }));
  }

  calculateClubStats(club: Club, matches: Match[]): ClubStandingStats {
    const stats: ClubStandingStats = {
      clubId: club.id,
      clubName: club.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };

    for (const match of matches) {
      const result = this.calculateResult(match);

      if (match.homeClubId === club.id) {
        this.addMatchResult(stats, match.homeGoals, match.awayGoals, result, MatchResult.MANDANTE);
      }

      if (match.awayClubId === club.id) {
        this.addMatchResult(stats, match.awayGoals, match.homeGoals, result, MatchResult.VISITANTE);
      }
    }

    stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
    stats.points = stats.wins * POINTS_PER_WIN + stats.draws * POINTS_PER_DRAW;

    return stats;
  }

  addMatchResult(stats: ClubStandingStats, goalsFor: number, goalsAgainst: number, result: MatchResult, winningResult: MatchResult): void {
    stats.played += 1;
    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;

    if (result === winningResult) {
      stats.wins += 1;
      return;
    }

    if (result === MatchResult.EMPATE) {
      stats.draws += 1;
      return;
    }

    stats.losses += 1;
  }

  calculateResult(match: Match): MatchResult {
    if (match.homeGoals > match.awayGoals) {
      return MatchResult.MANDANTE;
    }

    if (match.homeGoals < match.awayGoals) {
      return MatchResult.VISITANTE;
    }

    return MatchResult.EMPATE;
  }
}
