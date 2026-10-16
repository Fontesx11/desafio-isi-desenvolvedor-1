import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsController } from './clubs.controller.js';
import { ClubsService } from './clubs.service.js';
import { Club } from './entities/club.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Club])],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
