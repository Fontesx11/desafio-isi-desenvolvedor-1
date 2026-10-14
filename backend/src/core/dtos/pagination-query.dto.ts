import { IsInt, Max, Min } from 'class-validator';
import { ToPositiveInteger } from '../transformers/to-positive-integer.decorator.js';

export class PaginationQueryDto {
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
