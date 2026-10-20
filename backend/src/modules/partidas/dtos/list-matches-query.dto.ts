import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';

export class ListMatchesQueryDto {
  @ApiPropertyOptional({ description: 'Só as partidas em que o clube foi mandante ou visitante', example: 1 })
  @IsOptional()
  @ToPositiveInteger()
  @IsInt({ message: 'o clube deve ser um id inteiro' })
  @Min(1, { message: 'o clube deve ser um id maior que zero' })
  club_id?: number;
}
