import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MS_PER_DAY } from '../../core/utils/date.utils.js';
import { Contract } from './entities/contract.entity.js';
import { ContractStatus } from './enums/contracts.enum.js';

const MAX_LOYALTY_DAYS = 1095;

export type CreateContractData = Pick<
  Contract,
  'playerId' | 'clubId' | 'purchaseValue' | 'loyaltyUntil'
>;

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
  ) {}

  async create(
    manager: EntityManager,
    data: CreateContractData,
  ): Promise<Contract> {
    const now = Date.now();
    const loyaltyUntil = data.loyaltyUntil.getTime();

    if (loyaltyUntil <= now) {
      throw new BadRequestException('loyalty_until must be in the future');
    }

    if (loyaltyUntil > now + MAX_LOYALTY_DAYS * MS_PER_DAY) {
      throw new BadRequestException(
        `loyalty_until must be at most ${MAX_LOYALTY_DAYS} days after the purchase`,
      );
    }

    const contract = manager.create(Contract, {
      ...data,
      status: ContractStatus.ATIVO,
      endedAt: null,
    });

    return manager.save(contract);
  }
}
