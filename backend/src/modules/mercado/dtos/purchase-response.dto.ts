import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { Contract } from '../../contratos/entities/contract.entity.js';
import { ContractStatus } from '../../contratos/enums/contracts.enum.js';
import { Transaction } from '../../transacoes/entities/transaction.entity.js';
import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';

export type Purchase = {
  transaction: Transaction;
  contract: Contract;
  clubCash: string;
};

export class PurchaseResponseDto extends TransactionResponseDto {
  contract: {
    purchase_value: number;
    loyalty_until: string;
    status: ContractStatus;
  };
  club_cash: number;

  constructor(purchase: Purchase) {
    super(purchase.transaction);
    this.contract = {
      purchase_value: Number(purchase.contract.purchaseValue),
      loyalty_until: formatBrasiliaDateTime(purchase.contract.loyaltyUntil),
      status: purchase.contract.status,
    };
    this.club_cash = Number(purchase.clubCash);
  }
}
