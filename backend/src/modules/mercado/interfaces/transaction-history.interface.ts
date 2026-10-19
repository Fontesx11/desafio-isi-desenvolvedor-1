import { Transaction } from '../../transacoes/entities/transaction.entity.js';
import { TransactionSummary } from '../../transacoes/interfaces/transaction.interface.js';

export interface TransactionHistory {
  transactions: Transaction[];
  summary: TransactionSummary;
}
