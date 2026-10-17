import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';

export type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt'>;

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    manager: EntityManager,
    data: CreateTransactionData,
  ): Promise<Transaction> {
    const transaction = manager.create(Transaction, data);

    return manager.save(transaction);
  }
}
