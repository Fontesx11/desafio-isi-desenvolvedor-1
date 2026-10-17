import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsService } from './contracts.service.js';
import { Contract } from './entities/contract.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
