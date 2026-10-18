import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Lineup } from './entities/lineup.entity.js';

@Injectable()
export class LineupsService {
  constructor(
    @InjectRepository(Lineup)
    private readonly lineupsRepository: Repository<Lineup>,
  ) {}

  async findByClub(clubId: number): Promise<Lineup[]> {
    return this.lineupsRepository.findBy({ clubId });
  }

  async replace(manager: EntityManager, clubId: number, playerIds: number[]): Promise<void> {
    await manager.delete(Lineup, { clubId });

    const lineup = playerIds.map((playerId) => manager.create(Lineup, { clubId, playerId }));

    await manager.save(lineup);
  }

  async removePlayer(manager: EntityManager, playerId: number): Promise<void> {
    await manager.delete(Lineup, { playerId });
  }
}
