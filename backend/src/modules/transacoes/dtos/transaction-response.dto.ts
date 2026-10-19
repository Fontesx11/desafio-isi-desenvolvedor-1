import { ApiProperty } from '@nestjs/swagger';
import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { Transaction } from '../entities/transaction.entity.js';
import { TransactionType } from '../enums/transactions.enum.js';

export class TransactionResponseDto {
  @ApiProperty({ description: 'ID da transação', example: 10 })
  id: number;
  @ApiProperty({ description: 'ID do clube', example: 1 })
  club_id: number;
  @ApiProperty({ description: 'ID do jogador', example: 2 })
  player_id: number;
  @ApiProperty({ description: 'Nome do jogador no momento da operação', example: 'Meia Lua' })
  player_name: string;
  @ApiProperty({ description: 'Tipo da transação', enum: TransactionType, example: TransactionType.COMPRA })
  type: TransactionType;
  @ApiProperty({ description: 'Valor de mercado no momento da operação', example: 37 })
  value: number;
  @ApiProperty({ description: 'Taxa de compra (RN13) ou comissão de venda (RN16)', example: 1.85 })
  fee: number;
  @ApiProperty({ description: 'Multa por fidelidade (RN15); 0 na compra', example: 0 })
  penalty: number;
  @ApiProperty({ description: 'Lucro da venda (RN16), positivo ou negativo; null na compra', type: Number, nullable: true, example: null })
  profit: number | null;
  @ApiProperty({ description: 'Variação do caixa: −(value + fee) na compra; value − penalty − fee na venda', example: -38.85 })
  cash_change: number;
  @ApiProperty({ description: 'Data e hora da operação (horário de Brasília)', example: '2026-11-02T10:15:00-03:00' })
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
    this.profit = transaction.profit === null ? null : Number(transaction.profit);
    this.cash_change = Number(transaction.cashChange);
    this.created_at = formatBrasiliaDateTime(transaction.createdAt);
  }
}
