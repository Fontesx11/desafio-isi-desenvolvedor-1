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
  @IsString({ message: 'a busca deve ser um texto' })
  @Length(2, 100, { message: 'a busca deve ter entre 2 e 100 caracteres' })
  @Matches(/^\P{Cc}*$/u, {
    message: 'a busca não pode ter caracteres de controle',
  })
  search?: string;

  @ApiPropertyOptional({ description: 'Filtra pela posição', enum: PlayerPosition })
  @IsOptional()
  @IsEnum(PlayerPosition, { message: 'a posição deve ser um dos valores: GOL, ZAG, LAT, MEI, ATA' })
  position?: PlayerPosition;

  @ApiPropertyOptional({ description: 'Filtra pela condição', enum: PlayerCondition })
  @IsOptional()
  @IsEnum(PlayerCondition, { message: 'a condição deve ser um dos valores: APTO, MAL_CONDICIONADO, DOENTE' })
  condition?: PlayerCondition;

  @ApiPropertyOptional({ description: 'true lista só jogadores sem clube; false, só jogadores com clube', type: Boolean })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean({ message: 'o filtro de livres deve ser true ou false' })
  free?: boolean;

  @ApiPropertyOptional({ description: 'Filtra pelo clube. Não pode ser combinado com free=true', type: Number })
  @IsOptional()
  @ToPositiveInteger()
  @IsInt({ message: 'o clube deve ser um id inteiro' })
  @Min(1, { message: 'o clube deve ser um id maior que zero' })
  @CrossFieldRule<ListPlayersQueryDto>((dto) => dto.free !== true, 'o clube não pode ser combinado com free=true')
  club_id?: number;

  @ApiPropertyOptional({ default: 16, description: 'Idade mínima (16 a 45)' })
  @ToPositiveInteger()
  @IsInt({ message: 'a idade mínima deve ser um número inteiro' })
  @Min(16, { message: 'a idade mínima deve estar entre 16 e 45' })
  @Max(45, { message: 'a idade mínima deve estar entre 16 e 45' })
  min_age: number = 16;

  @ApiPropertyOptional({ default: 45, description: 'Idade máxima (16 a 45)' })
  @ToPositiveInteger()
  @IsInt({ message: 'a idade máxima deve ser um número inteiro' })
  @Min(16, { message: 'a idade máxima deve estar entre 16 e 45' })
  @Max(45, { message: 'a idade máxima deve estar entre 16 e 45' })
  @CrossFieldRule<ListPlayersQueryDto>((dto) => !(dto.min_age > dto.max_age), 'a idade mínima não pode ser maior que a idade máxima')
  max_age: number = 45;

  @ApiPropertyOptional({ default: 0, description: 'Valor de mercado mínimo (0 a 550, até duas casas decimais)' })
  @Transform(toDecimal)
  @IsNumber({}, { message: 'o valor mínimo deve ser um número com até duas casas decimais' })
  @Min(0, { message: 'o valor mínimo deve estar entre 0 e 550' })
  @Max(550, { message: 'o valor mínimo deve estar entre 0 e 550' })
  min_value: number = 0;

  @ApiPropertyOptional({ default: 550, description: 'Valor de mercado máximo (0 a 550, até duas casas decimais)' })
  @Transform(toDecimal)
  @IsNumber({}, { message: 'o valor máximo deve ser um número com até duas casas decimais' })
  @Min(0, { message: 'o valor máximo deve estar entre 0 e 550' })
  @Max(550, { message: 'o valor máximo deve estar entre 0 e 550' })
  @CrossFieldRule<ListPlayersQueryDto>((dto) => !(dto.min_value > dto.max_value), 'o valor mínimo não pode ser maior que o valor máximo')
  max_value: number = 550;

  @ApiPropertyOptional({
    description: 'Até dois critérios de ordenação, separados por vírgula. Ex.: position,value_desc',
    enum: PlayerSort,
    isArray: true,
    default: [PlayerSort.NAME],
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.split(',') : value))
  @ArrayMaxSize(2, { message: 'a ordenação deve ter no máximo 2 critérios' })
  @ArrayUnique((option: PlayerSort) => option.split('_')[0], { message: 'a ordenação não pode repetir o campo' })
  @IsEnum(PlayerSort, { each: true, message: 'cada critério de ordenação deve ser um dos valores: name, value_asc, value_desc, age_asc, age_desc, position' })
  sort: PlayerSort[] = [PlayerSort.NAME];
}
