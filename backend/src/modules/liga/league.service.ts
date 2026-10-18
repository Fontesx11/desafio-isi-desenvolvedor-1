import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { roundDivision } from '../../core/utils/math.utils.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { ClubFormation } from '../clubes/enums/clubs.enum.js';
import { LINEUP_SIZE } from '../escalacoes/constants/lineups.constants.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { Player } from '../jogadores/entities/player.entity.js';
import {
  PlayerCondition,
  PlayerPosition,
} from '../jogadores/enums/players.enum.js';
import { PlayersService } from '../jogadores/players.service.js';
import { DuelAttribute } from '../partidas/enums/matches.enum.js';
import {
  CreateMatchData,
  CreateMatchDuelData,
  MatchDetails,
} from '../partidas/interfaces/match.interface.js';
import { MatchesService } from '../partidas/matches.service.js';
import {
  AWAY_FIRST_DUEL,
  DUEL_PAIRS,
  FORMATION_SECTORS,
  HOME_FIRST_DUEL,
  MAL_CONDICIONADO_PERCENT,
} from './constants/league.constants.js';
import { CreateMatchDto } from './dtos/create-match.dto.js';
import { UpdateLineupDto } from './dtos/update-lineup.dto.js';
import { ClubLineup } from './interfaces/lineup.interface.js';

@Injectable()
export class LeagueService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clubsService: ClubsService,
    private readonly playersService: PlayersService,
    private readonly lineupsService: LineupsService,
    private readonly matchesService: MatchesService,
  ) {}

  async updateLineup(
    clubId: number,
    dto: UpdateLineupDto,
  ): Promise<ClubLineup> {
    await this.clubsService.findOne({ id: clubId });

    const players: Player[] = [];

    for (const playerId of dto.player_ids) {
      const player = await this.playersService.findOne({ id: playerId });

      if (player.clubId !== clubId) {
        throw new ConflictException('the player does not belong to the club');
      }

      if (player.condition === PlayerCondition.DOENTE) {
        throw new ConflictException('a sick player cannot be in the lineup');
      }

      players.push(player);
    }

    this.assertPositionsMatchFormation(players, dto.formation);

    await this.dataSource.transaction(async (manager) => {
      await this.clubsService.changeFormation(manager, clubId, dto.formation);
      await this.lineupsService.replace(manager, clubId, dto.player_ids);
    });

    return this.findLineup(clubId);
  }

  assertPositionsMatchFormation(
    players: Player[],
    formation: ClubFormation,
  ): void {
    const sectors = FORMATION_SECTORS[formation];

    const goalkeepers = players.filter(
      (player) => player.position === PlayerPosition.GOL,
    ).length;
    const defenders = players.filter(
      (player) =>
        player.position === PlayerPosition.ZAG ||
        player.position === PlayerPosition.LAT,
    ).length;
    const midfielders = players.filter(
      (player) => player.position === PlayerPosition.MEI,
    ).length;
    const attackers = players.filter(
      (player) => player.position === PlayerPosition.ATA,
    ).length;

    if (
      goalkeepers !== 1 ||
      defenders !== sectors.defense ||
      midfielders !== sectors.midfield ||
      attackers !== sectors.attack
    ) {
      throw new ConflictException(
        'the player positions do not match the formation',
      );
    }
  }

  async findLineup(clubId: number): Promise<ClubLineup> {
    const club = await this.clubsService.findOne(
      { id: clubId },
      { players: true },
    );
    const lineup = await this.lineupsService.findByClub(clubId);
    const { squad } = this.clubsService.calculateDynamicValues(club);

    const players = squad.filter((player) =>
      lineup.some((item) => item.playerId === player.id),
    );

    return {
      clubId: club.id,
      formation: club.formation,
      complete: players.length === LINEUP_SIZE,
      players,
    };
  }

  async playMatch(dto: CreateMatchDto): Promise<MatchDetails> {
    const homeLineup = await this.findLineup(dto.home_club_id);
    const awayLineup = await this.findLineup(dto.away_club_id);

    if (
      !homeLineup.complete ||
      !awayLineup.complete ||
      homeLineup.formation === null ||
      awayLineup.formation === null
    ) {
      throw new ConflictException('both clubs must have a complete lineup');
    }

    const homeAttacks = this.calculateAttacks(
      homeLineup,
      awayLineup,
      HOME_FIRST_DUEL,
    );
    const awayAttacks = this.calculateAttacks(
      awayLineup,
      homeLineup,
      AWAY_FIRST_DUEL,
    );

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
      const match = await this.matchesService.create(manager, matchData, duels);
      return match.id;
    });

    return this.matchesService.findById(matchId);
  }

  calculateAttacks(
    attackingLineup: ClubLineup,
    defendingLineup: ClubLineup,
    firstOrder: number,
  ): CreateMatchDuelData[] {
    return DUEL_PAIRS.map((pair, index) => {
      const attacker = attackingLineup.players[pair.attacker];
      const defender = defendingLineup.players[pair.defender];
      const attackAttribute = this.getAttackAttribute(attacker.position);
      const attackValue = this.applyConditionPenalty(
        attacker,
        attacker[attackAttribute],
      );
      const defenseValue = this.applyConditionPenalty(
        defender,
        defender.defending,
      );

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
}
