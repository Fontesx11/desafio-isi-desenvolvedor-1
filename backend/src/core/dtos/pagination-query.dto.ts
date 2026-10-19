import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { ToPositiveInteger } from '../transformers/to-positive-integer.decorator.js';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Número da página' })
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Itens por página (máximo 50)' })
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
