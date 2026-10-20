import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';

export class CreateMatchDto {
  @ApiProperty({ description: 'ID do clube mandante', example: 1 })
  @IsInt({ message: 'o mandante deve ser um id inteiro' })
  @Min(1, { message: 'o mandante deve ser um id maior que zero' })
  home_club_id: number;

  @ApiProperty({ description: 'ID do clube visitante, diferente do mandante', example: 2 })
  @IsInt({ message: 'o visitante deve ser um id inteiro' })
  @Min(1, { message: 'o visitante deve ser um id maior que zero' })
  @CrossFieldRule<CreateMatchDto>((dto) => dto.away_club_id !== dto.home_club_id, 'o visitante deve ser diferente do mandante')
  away_club_id: number;
}
