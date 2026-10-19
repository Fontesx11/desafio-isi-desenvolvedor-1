import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from '../../transacoes/dtos/transaction-response.dto.js';
import { TransactionSummary } from '../../transacoes/interfaces/transaction.interface.js';
import { TransactionHistory } from '../interfaces/transaction-history.interface.js';

export class TransactionSummaryResponseDto {
  @ApiProperty({ description: 'Soma de value + fee das compras', example: 38.85 })
  total_spent: number;
  @ApiProperty({ description: 'Soma de cash_change das vendas', example: 35.7 })
  total_received: number;
  @ApiProperty({ description: 'Soma de fee de todas as transações (taxas e comissões)', example: 2.15 })
  total_fees: number;
  @ApiProperty({ description: 'Soma de penalty das vendas', example: 4 })
  total_penalties: number;
  @ApiProperty({ description: 'Soma de profit das vendas, com sinal', example: 3 })
  total_profit: number;

  constructor(summary: TransactionSummary) {
    this.total_spent = Number(summary.totalSpent);
    this.total_received = Number(summary.totalReceived);
    this.total_fees = Number(summary.totalFees);
    this.total_penalties = Number(summary.totalPenalties);
    this.total_profit = Number(summary.totalProfit);
  }
}

export class TransactionHistoryResponseDto {
  @ApiProperty({ description: 'Transações do clube, da mais recente para a mais antiga', type: [TransactionResponseDto] })
  data: TransactionResponseDto[];
  @ApiProperty({ description: 'Totais das transações filtradas', type: TransactionSummaryResponseDto })
  summary: TransactionSummaryResponseDto;

  constructor(history: TransactionHistory) {
    this.data = history.transactions.map((transaction) => new TransactionResponseDto(transaction));
    this.summary = new TransactionSummaryResponseDto(history.summary);
  }
}
