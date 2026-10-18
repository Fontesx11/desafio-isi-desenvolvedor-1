import { Contract } from '../entities/contract.entity.js';

export type CreateContractData = Pick<Contract, 'playerId' | 'clubId' | 'purchaseValue' | 'loyaltyUntil'>;

export interface ContractSummary extends Pick<Contract, 'purchaseValue' | 'loyaltyUntil'> {
  remainingDays: number;
  penaltyRate: number;
}
