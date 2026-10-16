import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from '../clubes/clubs.module.js';
import { Player } from './entities/player.entity.js';
import { PlayersController } from './players.controller.js';
import { PlayersService } from './players.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), ClubsModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
