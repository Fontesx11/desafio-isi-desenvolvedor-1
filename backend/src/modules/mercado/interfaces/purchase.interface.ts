import { Contract } from '../../contratos/entities/contract.entity.js';
import { Transaction } from '../../transacoes/entities/transaction.entity.js';

export interface Purchase {
  transaction: Transaction;
  contract: Contract;
  clubCash: string;
}
