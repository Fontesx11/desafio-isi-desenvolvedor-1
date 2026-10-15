import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Page, paginate } from '../../core/utils/pagination.utils.js';
import { CreatePlayerDto } from './dtos/create-player.dto.js';
import { ListPlayersQueryDto } from './dtos/list-players-query.dto.js';
import { PlayerWithDynamicValues } from './dtos/player-response.dto.js';
import { UpdatePlayerDto } from './dtos/update-player.dto.js';
import { Player } from './entities/player.entity.js';
import { PlayerCondition } from './enums/players.enum.js';
import {
  calculateBaseValueCents,
  calculateMarketValueCents,
  calculateOverall,
} from './utils/players.calculations.js';
import { filterPlayers } from './utils/players.filtering.js';
import { sortPlayers } from './utils/players.sorting.js';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>,
  ) {}

  async create(dto: CreatePlayerDto): Promise<PlayerWithDynamicValues> {
    const overall = calculateOverall(dto.position, dto);
    const baseValueCents = calculateBaseValueCents(
      overall,
      dto.potential,
      dto.age,
    );

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

    return this.calculateDynamicValues(player);
  }

  async changePlayerCondition(
    id: number,
    condition: PlayerCondition,
  ): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    if (
      player.condition === PlayerCondition.DOENTE &&
      condition === PlayerCondition.APTO
    ) {
      throw new ConflictException(
        'condition cannot change directly from DOENTE to APTO',
      );
    }

    if (player.condition !== condition) {
      player.condition = condition;
      await this.playersRepository.save(player);
    }

    return this.calculateDynamicValues(player);
  }

  async update(
    id: number,
    dto: UpdatePlayerDto,
  ): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    if (player.clubId !== null && dto.position !== player.position) {
      throw new ConflictException(
        'a player with a club cannot change position',
      );
    }

    if (dto.age < player.age) {
      throw new ConflictException('age cannot be lower than the current age');
    }

    this.playersRepository.merge(player, dto);
    await this.playersRepository.save(player);

    return this.calculateDynamicValues(player);
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
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async findAll(
    query: ListPlayersQueryDto,
  ): Promise<Page<PlayerWithDynamicValues>> {
    const players = await this.playersRepository.find();
    const filteredPlayers = filterPlayers(
      players.map((player) => this.calculateDynamicValues(player)),
      query,
    );
    const sortedPlayers = sortPlayers(filteredPlayers, query.sort);

    return paginate(sortedPlayers, query.page, query.limit);
  }

  async findById(id: number): Promise<PlayerWithDynamicValues> {
    const player = await this.findOne({ id });

    return this.calculateDynamicValues(player);
  }

  calculateDynamicValues(player: Player): PlayerWithDynamicValues {
    const marketValue =
      calculateMarketValueCents(
        Math.round(Number(player.baseValue) * 100),
        player.condition,
        player.agility,
        player.age,
      ) / 100;

    return {
      ...player,
      overall: calculateOverall(player.position, player),
      marketValue,
    };
  }
}
