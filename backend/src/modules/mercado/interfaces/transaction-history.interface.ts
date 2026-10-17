import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { Transaction } from '../../transacoes/entities/transaction.entity.js';
import { TransactionSummary } from '../../transacoes/transactions.service.js';
import { TransactionSummaryResponseDto } from '../dtos/transaction-history-response.dto.js';

export interface TransactionHistory {
  transactions: Transaction[];
  summary: TransactionSummary;
}

export interface TransactionHistoryResponse {
  data: TransactionResponseDto[];
  summary: TransactionSummaryResponseDto;
}
