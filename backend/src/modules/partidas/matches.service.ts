import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MatchDuel } from './entities/match-duel.entity.js';
import { Match } from './entities/match.entity.js';
import { MatchResult } from './enums/matches.enum.js';
import {
  CreateMatchData,
  CreateMatchDuelData,
  MatchDetails,
} from './interfaces/match.interface.js';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
    @InjectRepository(MatchDuel)
    private readonly matchDuelsRepository: Repository<MatchDuel>,
  ) {}

  async create(
    manager: EntityManager,
    data: CreateMatchData,
    duels: CreateMatchDuelData[],
  ): Promise<Match> {
    const match = manager.create(Match, data);
    await manager.save(match);

    const matchDuels = duels.map((duel) =>
      manager.create(MatchDuel, { ...duel, matchId: match.id }),
    );

    await manager.save(matchDuels);

    return match;
  }

  async findById(id: number): Promise<MatchDetails> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: { homeClub: true, awayClub: true },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const duels = await this.matchDuelsRepository.find({
      where: { matchId: id },
      order: { order: 'ASC' },
    });

    return { match, result: this.calculateResult(match), duels };
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
