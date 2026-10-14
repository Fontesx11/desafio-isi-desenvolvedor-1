import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dtos/create-player.dto.js';
import { Player } from './entities/player.entity.js';
import { PlayerCondition } from './enums/players.enum.js';
import {
  calculateBaseValueCents,
  calculateOverall,
} from './utils/players.calculations.js';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>,
  ) {}

  async create(dto: CreatePlayerDto): Promise<Player> {
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

    return this.playersRepository.save(player);
  }
}
