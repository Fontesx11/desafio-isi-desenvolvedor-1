import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/typeorm-config.service.js';
import { ClubsModule } from './modules/clubes/clubs.module.js';
import { PlayersModule } from './modules/jogadores/players.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    PlayersModule,
    ClubsModule,
  ],
})
export class AppModule {}
