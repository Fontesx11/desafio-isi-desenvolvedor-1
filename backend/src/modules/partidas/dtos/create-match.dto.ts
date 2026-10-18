import { IsInt, Min } from 'class-validator';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';

export class CreateMatchDto {
  @IsInt()
  @Min(1)
  home_club_id: number;

  @IsInt()
  @Min(1)
  @CrossFieldRule<CreateMatchDto>((dto) => dto.away_club_id !== dto.home_club_id, 'away_club_id must be different from home_club_id')
  away_club_id: number;
}
