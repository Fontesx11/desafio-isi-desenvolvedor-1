import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/typeorm-config.service.js';
import { ClubsModule } from './modules/clubes/clubs.module.js';
import { ContractsModule } from './modules/contratos/contracts.module.js';
import { LineupsModule } from './modules/escalacoes/lineups.module.js';
import { PlayersModule } from './modules/jogadores/players.module.js';
import { LeagueModule } from './modules/liga/league.module.js';
import { MarketModule } from './modules/mercado/market.module.js';
import { MatchesModule } from './modules/partidas/matches.module.js';
import { TransactionsModule } from './modules/transacoes/transactions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    PlayersModule,
    ClubsModule,
    ContractsModule,
    TransactionsModule,
    MarketModule,
    LineupsModule,
    MatchesModule,
    LeagueModule,
  ],
})
export class AppModule {}
