import { Module } from '@nestjs/common';
import { ClubsModule } from '../clubes/clubs.module.js';
import { ContractsModule } from '../contratos/contracts.module.js';
import { PlayersModule } from '../jogadores/players.module.js';
import { TransactionsModule } from '../transacoes/transactions.module.js';
import { MarketController } from './market.controller.js';
import { MarketService } from './market.service.js';

@Module({
  imports: [PlayersModule, ClubsModule, ContractsModule, TransactionsModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
