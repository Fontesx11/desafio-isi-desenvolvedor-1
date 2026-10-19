import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ClubsService } from '../clubes/clubs.service.js';
import { ClubFormation } from '../clubes/enums/clubs.enum.js';
import { LINEUP_SIZE } from '../escalacoes/constants/lineups.constants.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { Player } from '../jogadores/entities/player.entity.js';
import { PlayerCondition, PlayerPosition } from '../jogadores/enums/players.enum.js';
import { PlayersService } from '../jogadores/players.service.js';
import { FORMATION_SECTORS } from './constants/league.constants.js';
import { UpdateLineupDto } from './dtos/update-lineup.dto.js';
import { ClubLineup } from './interfaces/lineup.interface.js';

@Injectable()
export class LeagueService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clubsService: ClubsService,
    private readonly playersService: PlayersService,
    private readonly lineupsService: LineupsService,
  ) {}

  async updateLineup(clubId: number, dto: UpdateLineupDto): Promise<ClubLineup> {
    await this.clubsService.find({ where: { id: clubId } });

    const players: Player[] = [];

    for (const playerId of dto.player_ids) {
      const player = await this.playersService.findOne({ id: playerId });

      if (player.clubId !== clubId) {
        throw new ConflictException('o jogador não faz parte do elenco do clube');
      }

      if (player.condition === PlayerCondition.DOENTE) {
        throw new ConflictException('um jogador DOENTE não pode ser escalado');
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

  assertPositionsMatchFormation(players: Player[], formation: ClubFormation): void {
    const sectors = FORMATION_SECTORS[formation];

    const goalkeepers = players.filter((player) => player.position === PlayerPosition.GOL).length;
    const defenders = players.filter((player) => player.position === PlayerPosition.ZAG || player.position === PlayerPosition.LAT).length;
    const midfielders = players.filter((player) => player.position === PlayerPosition.MEI).length;
    const attackers = players.filter((player) => player.position === PlayerPosition.ATA).length;

    if (goalkeepers !== 1 || defenders !== sectors.defense || midfielders !== sectors.midfield || attackers !== sectors.attack) {
      throw new ConflictException('as posições dos jogadores não fecham a formação');
    }
  }

  async findLineup(clubId: number): Promise<ClubLineup> {
    const club = await this.clubsService.find({
      where: { id: clubId },
      relations: { players: true },
    });
    const lineup = await this.lineupsService.findByClub(clubId);
    const { squad } = this.clubsService.calculateDynamicValues(club);

    const players = squad.filter((player) => lineup.some((item) => item.playerId === player.id));

    return {
      clubId: club.id,
      formation: club.formation,
      complete: players.length === LINEUP_SIZE,
      players,
    };
  }
}
