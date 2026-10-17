import { Transaction } from '../entities/transaction.entity.js';

export type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt'>;

export interface TransactionSummary {
  totalSpent: string;
  totalReceived: string;
  totalFees: string;
  totalPenalties: string;
  totalProfit: string;
}
