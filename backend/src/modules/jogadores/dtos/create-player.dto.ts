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
  @IsString()
  @Length(3, 100)
  @Matches(/^\P{Cc}*$/u, {
    message: 'name must not contain control characters',
  })
  @Matches(/^[^0-9]*$/, { message: 'name must not contain digits' })
  @Matches(/\p{L}.* .*\p{L}/u, {
    message: 'name must have at least two words',
  })
  name: string;

  @ApiProperty({ description: 'Posição do jogador', enum: PlayerPosition, example: PlayerPosition.GOL })
  @IsEnum(PlayerPosition)
  position: PlayerPosition;

  @ApiProperty({ description: 'Agilidade (1 a 100). Para jogadores com 35 anos ou mais, no máximo 85', example: 80 })
  @IsInt()
  @Min(1)
  @Max(100)
  @CrossFieldRule<CreatePlayerDto>((dto) => !(dto.age >= 35 && dto.agility > 85), 'agility must be at most 85 for players aged 35 or older')
  agility: number;

  @ApiProperty({ description: 'Idade (16 a 45)', example: 20 })
  @IsInt()
  @Min(16)
  @Max(45)
  age: number;

  @ApiProperty({ description: 'Velocidade (1 a 99)', example: 70 })
  @IsInt()
  @Min(1)
  @Max(99)
  pace: number;

  @ApiProperty({ description: 'Finalização (1 a 99)', example: 50 })
  @IsInt()
  @Min(1)
  @Max(99)
  shooting: number;

  @ApiProperty({ description: 'Passe (1 a 99)', example: 75 })
  @IsInt()
  @Min(1)
  @Max(99)
  passing: number;

  @ApiProperty({ description: 'Drible (1 a 99)', example: 60 })
  @IsInt()
  @Min(1)
  @Max(99)
  dribbling: number;

  @ApiProperty({ description: 'Defesa (1 a 99)', example: 90 })
  @IsInt()
  @Min(1)
  @Max(99)
  defending: number;

  @ApiProperty({ description: 'Físico (1 a 99). A soma dos seis atributos deve ser no máximo 480', example: 85 })
  @IsInt()
  @Min(1)
  @Max(99)
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.pace + dto.shooting + dto.passing + dto.dribbling + dto.defending + dto.physical > MAX_ATTRIBUTES_SUM),
    `the sum of the six attributes must be at most ${MAX_ATTRIBUTES_SUM}`,
  )
  physical: number;

  @ApiProperty({ description: 'Potencial (1 a 99). Deve ser pelo menos o maior atributo; a partir de 33 anos, igual ao maior atributo', example: 95 })
  @IsInt()
  @Min(1)
  @Max(99)
  @CrossFieldRule<CreatePlayerDto>((dto) => !(dto.potential < highestAttribute(dto)), 'potential must be at least the highest attribute')
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.age >= 33 && dto.potential > highestAttribute(dto)),
    'potential must equal the highest attribute for players aged 33 or older',
  )
  potential: number;
}
