import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity.js';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';
import { PlayersModule } from '../jogadores/players.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), PlayersModule],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
