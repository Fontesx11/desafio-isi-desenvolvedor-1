import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Page, paginate } from '../../core/utils/pagination.utils.js';
import { ClubsService } from '../clubes/clubs.service.js';
import { LineupsService } from '../escalacoes/lineups.service.js';
import { CreatePlayerDto } from './dtos/create-player.dto.js';
import { ListPlayersQueryDto } from './dtos/list-players-query.dto.js';
import { UpdatePlayerDto } from './dtos/update-player.dto.js';
import { Player } from './entities/player.entity.js';
import { PlayerCondition } from './enums/players.enum.js';
import { PlayerWithDynamicValues } from './interfaces/player.interface.js';
import { calculateBaseValueCents, calculateOverall, calculatePlayerDynamicValues } from './utils/players.calculations.js';
import { filterPlayers } from './utils/players.filtering.js';
import { sortPlayers } from './utils/players.sorting.js';

@Injectable()
export class PlayersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>,
    private readonly clubsService: ClubsService,
    private readonly lineupsService: LineupsService,
  ) {}

  async create(dto: CreatePlayerDto): Promise<PlayerWithDynamicValues> {
    const overall = calculateOverall(dto.position, dto);
    const baseValueCents = calculateBaseValueCents(overall, dto.potential, dto.age);

    const player = this.playersRepository.create({
      name: dto.name,
      position: dto.position,
      agility: dto.agility,
      age: dto.age,
      pace: dto.pace,
      shooting: dto.shooting,
      passing: dto.passing,
      dribbling: dto.dribbling,
      defending: dto.defending,
      physical: dto.physical,
      potential: dto.potential,
      baseValue: (baseValueCents / 100).toFixed(2),
      condition: PlayerCondition.APTO,
      clubId: null,
    });

    await this.playersRepository.save(player);

    return calculatePlayerDynamicValues(player);
  }

  async changePlayerCondition(id: number, condition: PlayerCondition): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    if (player.condition === PlayerCondition.DOENTE && condition === PlayerCondition.APTO) {
      throw new ConflictException('condition cannot change directly from DOENTE to APTO');
    }

    if (player.condition !== condition) {
      player.condition = condition;

      await this.dataSource.transaction(async (manager) => {
        await manager.save(player);

        if (condition === PlayerCondition.DOENTE) {
          await this.lineupsService.removePlayer(manager, player.id);
        }
      });
    }

    return calculatePlayerDynamicValues(player);
  }

  async update(id: number, dto: UpdatePlayerDto): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    if (player.clubId !== null && dto.position !== player.position) {
      throw new ConflictException('a player with a club cannot change position');
    }

    if (dto.age < player.age) {
      throw new ConflictException('age cannot be lower than the current age');
    }

    this.playersRepository.merge(player, dto);
    await this.playersRepository.save(player);

    return calculatePlayerDynamicValues(player);
  }

  async assignToClub(manager: EntityManager, playerId: number, clubId: number): Promise<void> {
    await manager.update(Player, { id: playerId }, { clubId });
  }

  async releaseFromClub(manager: EntityManager, playerId: number): Promise<void> {
    await manager.update(Player, { id: playerId }, { clubId: null });
  }

  async remove(id: number): Promise<void> {
    const player = await this.findOne({ id });

    if (player.clubId !== null) {
      throw new ConflictException('a player with a club cannot be deleted');
    }

    await this.playersRepository.softRemove(player);
  }

  async findOne(condition: FindOptionsWhere<Player>): Promise<Player> {
    const player = await this.playersRepository.findOneBy(condition);

    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    return player;
  }

  async findAll(query: ListPlayersQueryDto): Promise<Page<PlayerWithDynamicValues>> {
    if (query.club_id !== undefined) {
      await this.clubsService.find({ where: { id: query.club_id } });
    }

    const players = await this.playersRepository.find();
    const filteredPlayers = filterPlayers(
      players.map((player) => calculatePlayerDynamicValues(player)),
      query,
    );
    const sortedPlayers = sortPlayers(filteredPlayers, query.sort);

    return paginate(sortedPlayers, query.page, query.limit);
  }

  async findById(id: number): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    return calculatePlayerDynamicValues(player);
  }
}
