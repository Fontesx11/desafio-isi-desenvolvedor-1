import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../core/dtos/pagination-query.dto.js';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { ToPositiveInteger } from '../../../core/transformers/to-positive-integer.decorator.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import { PlayerCondition, PlayerPosition, PlayerSort } from '../enums/players.enum.js';

const DECIMAL_PATTERN = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;

function toDecimal({ value }: { value: unknown }): unknown {
  return typeof value === 'string' && DECIMAL_PATTERN.test(value) ? Number(value) : value;
}

export class ListPlayersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Busca por parte do nome (2 a 100 caracteres)', example: 'Mark' })
  @IsOptional()
  @NormalizeSpaces()
  @IsString()
  @Length(2, 100)
  @Matches(/^\P{Cc}*$/u, {
    message: 'search must not contain control characters',
  })
  search?: string;

  @ApiPropertyOptional({ description: 'Filtra pela posição', enum: PlayerPosition })
  @IsOptional()
  @IsEnum(PlayerPosition)
  position?: PlayerPosition;

  @ApiPropertyOptional({ description: 'Filtra pela condição', enum: PlayerCondition })
  @IsOptional()
  @IsEnum(PlayerCondition)
  condition?: PlayerCondition;

  @ApiPropertyOptional({ description: 'true lista só jogadores sem clube; false, só jogadores com clube', type: Boolean })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  free?: boolean;

  @ApiPropertyOptional({ description: 'Filtra pelo clube. Não pode ser combinado com free=true', type: Number })
  @IsOptional()
  @ToPositiveInteger()
  @IsInt()
  @Min(1)
  @CrossFieldRule<ListPlayersQueryDto>((dto) => dto.free !== true, 'club_id cannot be combined with free=true')
  club_id?: number;

  @ApiPropertyOptional({ default: 16, description: 'Idade mínima (16 a 45)' })
  @ToPositiveInteger()
  @IsInt()
  @Min(16)
  @Max(45)
  min_age: number = 16;

  @ApiPropertyOptional({ default: 45, description: 'Idade máxima (16 a 45)' })
  @ToPositiveInteger()
  @IsInt()
  @Min(16)
  @Max(45)
  @CrossFieldRule<ListPlayersQueryDto>((dto) => !(dto.min_age > dto.max_age), 'min_age must not be greater than max_age')
  max_age: number = 45;

  @ApiPropertyOptional({ default: 0, description: 'Valor de mercado mínimo (0 a 550, até duas casas decimais)' })
  @Transform(toDecimal)
  @IsNumber()
  @Min(0)
  @Max(550)
  min_value: number = 0;

  @ApiPropertyOptional({ default: 550, description: 'Valor de mercado máximo (0 a 550, até duas casas decimais)' })
  @Transform(toDecimal)
  @IsNumber()
  @Min(0)
  @Max(550)
  @CrossFieldRule<ListPlayersQueryDto>((dto) => !(dto.min_value > dto.max_value), 'min_value must not be greater than max_value')
  max_value: number = 550;

  @ApiPropertyOptional({
    description: 'Até dois critérios de ordenação, separados por vírgula. Ex.: position,value_desc',
    enum: PlayerSort,
    isArray: true,
    default: [PlayerSort.NAME],
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.split(',') : value))
  @ArrayMaxSize(2)
  @ArrayUnique((option: PlayerSort) => option.split('_')[0])
  @IsEnum(PlayerSort, { each: true })
  sort: PlayerSort[] = [PlayerSort.NAME];
}
