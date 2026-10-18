import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { escapeCsvValue, formatCsvDecimal } from '../../core/utils/csv.utils.js';
import { formatBrasiliaDateTime } from '../../core/utils/date.utils.js';
import { CSV_HEADER } from './constants/transactions.constants.js';
import { Transaction } from './entities/transaction.entity.js';
import { TransactionType } from './enums/transactions.enum.js';
import { CreateTransactionData, TransactionSummary } from './interfaces/transaction.interface.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async create(manager: EntityManager, data: CreateTransactionData): Promise<Transaction> {
    const transaction = manager.create(Transaction, data);

    return manager.save(transaction);
  }

  async hasSale(clubId: number, playerId: number): Promise<boolean> {
    return this.transactionsRepository.existsBy({
      clubId,
      playerId,
      type: TransactionType.VENDA,
    });
  }

  async findAll(condition: FindOptionsWhere<Transaction>): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: condition,
      order: { createdAt: 'DESC', id: 'DESC' },
    });
  }

  calculateSummary(transactions: Transaction[]): TransactionSummary {
    let spentCents = 0;
    let receivedCents = 0;
    let feesCents = 0;
    let penaltiesCents = 0;
    let profitCents = 0;

    for (const transaction of transactions) {
      const valueCents = Math.round(Number(transaction.value) * 100);
      const feeCents = Math.round(Number(transaction.fee) * 100);

      feesCents += feeCents;

      if (transaction.type === TransactionType.COMPRA) {
        spentCents += valueCents + feeCents;
      } else {
        receivedCents += Math.round(Number(transaction.cashChange) * 100);
        penaltiesCents += Math.round(Number(transaction.penalty) * 100);
        profitCents += Math.round(Number(transaction.profit) * 100);
      }
    }

    return {
      totalSpent: (spentCents / 100).toFixed(2),
      totalReceived: (receivedCents / 100).toFixed(2),
      totalFees: (feesCents / 100).toFixed(2),
      totalPenalties: (penaltiesCents / 100).toFixed(2),
      totalProfit: (profitCents / 100).toFixed(2),
    };
  }

  toCsv(transactions: Transaction[]): string {
    let csv = `${CSV_HEADER}\n`;

    for (const transaction of transactions) {
      const profit = transaction.profit === null ? '' : formatCsvDecimal(transaction.profit);

      const values = [
        formatBrasiliaDateTime(transaction.createdAt),
        transaction.type,
        escapeCsvValue(transaction.playerName),
        formatCsvDecimal(transaction.value),
        formatCsvDecimal(transaction.fee),
        formatCsvDecimal(transaction.penalty),
        profit,
        formatCsvDecimal(transaction.cashChange),
      ];

      csv += `${values.join(';')}\n`;
    }

    return csv;
  }
}
