import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { LINEUP_SIZE } from '../../escalacoes/constants/lineups.constants.js';

export class UpdateLineupDto {
  @IsEnum(ClubFormation)
  formation: ClubFormation;

  @IsArray()
  @ArrayMinSize(LINEUP_SIZE)
  @ArrayMaxSize(LINEUP_SIZE)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  player_ids: number[];
}
