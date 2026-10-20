import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';
import { TransactionType } from '../../transacoes/enums/transactions.enum.js';

export class ListTransactionsQueryDto {
  @ApiPropertyOptional({
    description: 'Um ou mais tipos, separados por vírgula, sem espaços e sem repetição. Ex.: COMPRA,VENDA. Sem o filtro, traz os dois tipos',
    enum: TransactionType,
    isArray: true,
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.split(',') : value))
  @ArrayUnique({ message: 'os tipos não podem se repetir' })
  @IsEnum(TransactionType, { each: true, message: 'cada tipo deve ser um dos valores: COMPRA, VENDA' })
  type: TransactionType[] = [TransactionType.COMPRA, TransactionType.VENDA];

  @ApiPropertyOptional({ description: 'Só as transações desse jogador no clube', example: 2 })
  @IsOptional()
  @ToPositiveInteger()
  @IsInt({ message: 'o jogador deve ser um id inteiro' })
  @Min(1, { message: 'o jogador deve ser um id maior que zero' })
  player_id?: number;
}
