import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueModule } from '../liga/league.module.js';
import { MatchDuel } from './entities/match-duel.entity.js';
import { Match } from './entities/match.entity.js';
import { MatchesController } from './matches.controller.js';
import { MatchesService } from './matches.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchDuel]), LeagueModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
