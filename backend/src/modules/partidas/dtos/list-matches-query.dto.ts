import { IsInt, IsOptional, Min } from 'class-validator';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';

export class ListMatchesQueryDto {
  @IsOptional()
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  club_id?: number;
}
