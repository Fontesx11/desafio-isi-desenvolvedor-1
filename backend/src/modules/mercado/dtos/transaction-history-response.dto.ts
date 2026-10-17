import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { Transaction } from '../../transacoes/entities/transaction.entity.js';
import { TransactionSummary } from '../../transacoes/transactions.service.js';

export type TransactionHistory = {
  transactions: Transaction[];
  summary: TransactionSummary;
};

export type TransactionHistoryResponse = {
  data: TransactionResponseDto[];
  summary: TransactionSummaryResponseDto;
};


export class TransactionSummaryResponseDto {
  total_spent: number;
  total_received: number;
  total_fees: number;
  total_penalties: number;
  total_profit: number;

  constructor(summary: TransactionSummary) {
    this.total_spent = Number(summary.totalSpent);
    this.total_received = Number(summary.totalReceived);
    this.total_fees = Number(summary.totalFees);
    this.total_penalties = Number(summary.totalPenalties);
    this.total_profit = Number(summary.totalProfit);
  }
}

