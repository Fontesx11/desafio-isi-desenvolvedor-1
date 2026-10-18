import { Module } from '@nestjs/common';
import { ClubsModule } from '../clubes/clubs.module.js';
import { LineupsModule } from '../escalacoes/lineups.module.js';
import { PlayersModule } from '../jogadores/players.module.js';
import { LeagueController } from './league.controller.js';
import { LeagueService } from './league.service.js';

@Module({
  imports: [ClubsModule, PlayersModule, LineupsModule],
  controllers: [LeagueController],
  providers: [LeagueService],
  exports: [LeagueService],
})
export class LeagueModule {}
