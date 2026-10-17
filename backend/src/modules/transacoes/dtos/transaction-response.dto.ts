import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { Transaction } from '../entities/transaction.entity.js';
import { TransactionType } from '../enums/transactions.enum.js';

export class TransactionResponseDto {
  id: number;
  club_id: number;
  player_id: number;
  player_name: string;
  type: TransactionType;
  value: number;
  fee: number;
  penalty: number;
  profit: number | null;
  cash_change: number;
  created_at: string;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.club_id = transaction.clubId;
    this.player_id = transaction.playerId;
    this.player_name = transaction.playerName;
    this.type = transaction.type;
    this.value = Number(transaction.value);
    this.fee = Number(transaction.fee);
    this.penalty = Number(transaction.penalty);
    this.profit =
      transaction.profit === null ? null : Number(transaction.profit);
    this.cash_change = Number(transaction.cashChange);
    this.created_at = formatBrasiliaDateTime(transaction.createdAt);
  }
}
