import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../../core/dtos/pagination-query.dto.js';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import {
  PlayerCondition,
  PlayerPosition,
  PlayerSort,
} from '../enums/players.enum.js';

export class ListPlayersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @NormalizeSpaces()
  @IsString()
  @Length(2, 100)
  @Matches(/^\P{Cc}*$/u, {
    message: 'search must not contain control characters',
  })
  search?: string;

  @IsOptional()
  @IsEnum(PlayerPosition)
  position?: PlayerPosition;

  @IsOptional()
  @IsEnum(PlayerCondition)
  condition?: PlayerCondition;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  free?: boolean;

  @ToPositiveInteger()
  @IsInt()
  @Min(16)
  @Max(45)
  min_age: number = 16;

  @ToPositiveInteger()
  @IsInt()
  @Min(16)
  @Max(45)
  @CrossFieldRule<ListPlayersQueryDto>(
    (dto) => !(dto.min_age > dto.max_age),
    'min_age must not be greater than max_age',
  )
  max_age: number = 45;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @ArrayMaxSize(2)
  @ArrayUnique((option: PlayerSort) => option.split('_')[0])
  @IsEnum(PlayerSort, { each: true })
  sort: PlayerSort[] = [PlayerSort.NAME];
}
