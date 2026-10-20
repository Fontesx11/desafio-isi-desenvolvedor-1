import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { ToPositiveInteger } from '../transformers/to-positive-integer.decorator.js';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Número da página' })
  @ToPositiveInteger()
  @IsInt({ message: 'a página deve ser um número inteiro' })
  @Min(1, { message: 'a página deve ser maior que zero' })
  page: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Itens por página (máximo 50)' })
  @ToPositiveInteger()
  @IsInt({ message: 'o limite deve ser um número inteiro' })
  @Min(1, { message: 'o limite deve estar entre 1 e 50' })
  @Max(50, { message: 'o limite deve estar entre 1 e 50' })
  limit: number = 10;
}
