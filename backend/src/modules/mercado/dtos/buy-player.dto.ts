import { IsInt, Min } from 'class-validator';
import { IsBrasiliaDateTime } from '../../../core/validators/is-brasilia-date-time.decorator.js';

export class BuyPlayerDto {
  @IsInt()
  @Min(1)
  club_id: number;

  @IsBrasiliaDateTime()
  loyalty_until: string;
}
