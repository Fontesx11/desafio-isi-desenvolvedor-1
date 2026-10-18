import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lineup } from './entities/lineup.entity.js';
import { LineupsService } from './lineups.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Lineup])],
  providers: [LineupsService],
  exports: [LineupsService],
})
export class LineupsModule {}
