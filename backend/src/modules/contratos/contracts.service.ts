import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  calculateRemainingDays,
  MS_PER_DAY,
} from '../../core/utils/date.utils.js';
import { Contract } from './entities/contract.entity.js';
import { ContractStatus } from './enums/contracts.enum.js';
import {
  ContractSummary,
  CreateContractData,
} from './interfaces/contract.interface.js';

const MAX_LOYALTY_DAYS = 1095;

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

  async findActiveByClub(clubId: number): Promise<Contract[]> {
    return this.contractsRepository.findBy({
      clubId,
      status: ContractStatus.ATIVO,
    });
  }

  async findActiveByPlayer(playerId: number): Promise<Contract> {
    const contract = await this.contractsRepository.findOneBy({
      playerId,
      status: ContractStatus.ATIVO,
    });

    if (!contract) {
      throw new NotFoundException('active contract not found');
    }

    return contract;
  }

  async close(
    manager: EntityManager,
    contract: Contract,
    status: ContractStatus,
    endedAt: Date,
  ): Promise<void> {
    await manager.update(Contract, { id: contract.id }, { status, endedAt });
  }

  calculateContractSummary(contract: Contract, now: Date): ContractSummary {
    const remainingDays = calculateRemainingDays(contract.loyaltyUntil, now);

    return {
      purchaseValue: contract.purchaseValue,
      loyaltyUntil: contract.loyaltyUntil,
      remainingDays,
      penaltyRate: this.calculatePenaltyRate(remainingDays),
    };
  }

  private calculatePenaltyRate(remainingDays: number): number {
    if (remainingDays === 0) return 0;
    if (remainingDays <= 30) return 5;
    if (remainingDays <= 180) return 10;

    return 20;
  }
}
