import { ContractStatus } from '../../contratos/enums/contracts.enum.js';
import { Transaction } from '../../transacoes/entities/transaction.entity.js';

export interface Sale {
  transaction: Transaction;
  purchaseValue: string;
  remainingDays: number;
  penaltyRate: number;
  contractStatus: ContractStatus;
  clubCash: string;
}
