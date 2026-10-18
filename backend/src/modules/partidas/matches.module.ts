import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from '../clubes/clubs.module.js';
import { LeagueModule } from '../liga/league.module.js';
import { MatchDuel } from './entities/match-duel.entity.js';
import { Match } from './entities/match.entity.js';
import { MatchesController } from './matches.controller.js';
import { MatchesService } from './matches.service.js';
import { StandingsController } from './standings.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchDuel]), ClubsModule, LeagueModule],
  controllers: [MatchesController, StandingsController],
  providers: [MatchesService],
})
export class MatchesModule {}
