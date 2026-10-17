import { ContractStatus } from '../../contratos/enums/contracts.enum.js';
import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { Sale } from '../interfaces/sale.interface.js';

export class SaleResponseDto extends TransactionResponseDto {
  purchase_value: number;
  remaining_days: number;
  penalty_rate: number;
  contract_status: ContractStatus;
  club_cash: number;

  constructor(sale: Sale) {
    super(sale.transaction);
    this.purchase_value = Number(sale.purchaseValue);
    this.remaining_days = sale.remainingDays;
    this.penalty_rate = sale.penaltyRate;
    this.contract_status = sale.contractStatus;
    this.club_cash = Number(sale.clubCash);
  }
}
