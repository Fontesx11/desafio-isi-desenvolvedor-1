import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Length, Matches, Max, Min } from 'class-validator';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import { PlayerPosition } from '../enums/players.enum.js';

const MAX_ATTRIBUTES_SUM = 480;

function highestAttribute(dto: CreatePlayerDto): number {
  return Math.max(dto.pace, dto.shooting, dto.passing, dto.dribbling, dto.defending, dto.physical);
}

export class CreatePlayerDto {
  @ApiProperty({ description: 'Nome do jogador (3 a 100 caracteres, pelo menos duas palavras e sem números)', example: 'Mark Evans' })
  @NormalizeSpaces()
  @IsString({ message: 'o nome deve ser um texto' })
  @Length(3, 100, { message: 'o nome deve ter entre 3 e 100 caracteres' })
  @Matches(/^\P{Cc}*$/u, {
    message: 'o nome não pode ter caracteres de controle',
  })
  @Matches(/^[^0-9]*$/, { message: 'o nome não pode ter dígitos' })
  @Matches(/\p{L}.* .*\p{L}/u, {
    message: 'o nome deve ter pelo menos duas palavras',
  })
  name: string;

  @ApiProperty({ description: 'Posição do jogador', enum: PlayerPosition, example: PlayerPosition.GOL })
  @IsEnum(PlayerPosition, { message: 'a posição deve ser um dos valores: GOL, ZAG, LAT, MEI, ATA' })
  position: PlayerPosition;

  @ApiProperty({ description: 'Agilidade (1 a 100). Para jogadores com 35 anos ou mais, no máximo 85', example: 80 })
  @IsInt({ message: 'a agilidade deve ser um número inteiro' })
  @Min(1, { message: 'a agilidade deve estar entre 1 e 100' })
  @Max(100, { message: 'a agilidade deve estar entre 1 e 100' })
  @CrossFieldRule<CreatePlayerDto>((dto) => !(dto.age >= 35 && dto.agility > 85), 'a agilidade deve ser no máximo 85 para jogadores com 35 anos ou mais')
  agility: number;

  @ApiProperty({ description: 'Idade (16 a 45)', example: 20 })
  @IsInt({ message: 'a idade deve ser um número inteiro' })
  @Min(16, { message: 'a idade deve estar entre 16 e 45' })
  @Max(45, { message: 'a idade deve estar entre 16 e 45' })
  age: number;

  @ApiProperty({ description: 'Velocidade (1 a 99)', example: 70 })
  @IsInt({ message: 'a velocidade deve ser um número inteiro' })
  @Min(1, { message: 'a velocidade deve estar entre 1 e 99' })
  @Max(99, { message: 'a velocidade deve estar entre 1 e 99' })
  pace: number;

  @ApiProperty({ description: 'Finalização (1 a 99)', example: 50 })
  @IsInt({ message: 'a finalização deve ser um número inteiro' })
  @Min(1, { message: 'a finalização deve estar entre 1 e 99' })
  @Max(99, { message: 'a finalização deve estar entre 1 e 99' })
  shooting: number;

  @ApiProperty({ description: 'Passe (1 a 99)', example: 75 })
  @IsInt({ message: 'o passe deve ser um número inteiro' })
  @Min(1, { message: 'o passe deve estar entre 1 e 99' })
  @Max(99, { message: 'o passe deve estar entre 1 e 99' })
  passing: number;

  @ApiProperty({ description: 'Drible (1 a 99)', example: 60 })
  @IsInt({ message: 'o drible deve ser um número inteiro' })
  @Min(1, { message: 'o drible deve estar entre 1 e 99' })
  @Max(99, { message: 'o drible deve estar entre 1 e 99' })
  dribbling: number;

  @ApiProperty({ description: 'Defesa (1 a 99)', example: 90 })
  @IsInt({ message: 'a defesa deve ser um número inteiro' })
  @Min(1, { message: 'a defesa deve estar entre 1 e 99' })
  @Max(99, { message: 'a defesa deve estar entre 1 e 99' })
  defending: number;

  @ApiProperty({ description: 'Físico (1 a 99). A soma dos seis atributos deve ser no máximo 480', example: 85 })
  @IsInt({ message: 'o físico deve ser um número inteiro' })
  @Min(1, { message: 'o físico deve estar entre 1 e 99' })
  @Max(99, { message: 'o físico deve estar entre 1 e 99' })
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.pace + dto.shooting + dto.passing + dto.dribbling + dto.defending + dto.physical > MAX_ATTRIBUTES_SUM),
    `a soma dos seis atributos não pode passar de ${MAX_ATTRIBUTES_SUM}`,
  )
  physical: number;

  @ApiProperty({ description: 'Potencial (1 a 99). Deve ser pelo menos o maior atributo; a partir de 33 anos, igual ao maior atributo', example: 95 })
  @IsInt({ message: 'o potencial deve ser um número inteiro' })
  @Min(1, { message: 'o potencial deve estar entre 1 e 99' })
  @Max(99, { message: 'o potencial deve estar entre 1 e 99' })
  @CrossFieldRule<CreatePlayerDto>((dto) => !(dto.potential < highestAttribute(dto)), 'o potencial deve ser maior ou igual ao maior dos seis atributos')
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.age >= 33 && dto.potential > highestAttribute(dto)),
    'o potencial deve ser igual ao maior dos seis atributos para jogadores com 33 anos ou mais',
  )
  potential: number;
}
