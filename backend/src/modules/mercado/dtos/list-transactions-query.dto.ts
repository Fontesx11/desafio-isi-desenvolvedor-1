import { Transform } from 'class-transformer';
import { ArrayUnique, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';
import { TransactionType } from '../../transacoes/enums/transactions.enum.js';

export class ListTransactionsQueryDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.split(',') : value))
  @ArrayUnique()
  @IsEnum(TransactionType, { each: true })
  type: TransactionType[] = [TransactionType.COMPRA, TransactionType.VENDA];

  @IsOptional()
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  player_id?: number;
}
