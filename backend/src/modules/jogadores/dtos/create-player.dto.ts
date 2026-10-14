import {
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import { PlayerPosition } from '../enums/players.enum.js';

const MAX_ATTRIBUTES_SUM = 480;

function highestAttribute(dto: CreatePlayerDto): number {
  return Math.max(
    dto.pace,
    dto.shooting,
    dto.passing,
    dto.dribbling,
    dto.defending,
    dto.physical,
  );
}

export class CreatePlayerDto {
  @NormalizeSpaces()
  @IsString()
  @Length(3, 100)
  @Matches(/^\P{Cc}*$/u, {
    message: 'name must not contain control characters',
  })
  @Matches(/^[^0-9]*$/, { message: 'name must not contain digits' })
  @Matches(/^[^ ]*\p{L}[^ ]*( [^ ]*\p{L}[^ ]*)+$/u, {
    message: 'name must have at least two words',
  })
  name: string;

  @IsEnum(PlayerPosition)
  position: PlayerPosition;

  @IsInt()
  @Min(1)
  @Max(100)
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.age >= 35 && dto.agility > 85),
    'agility must be at most 85 for players aged 35 or older',
  )
  agility: number;

  @IsInt()
  @Min(16)
  @Max(45)
  age: number;

  @IsInt()
  @Min(1)
  @Max(99)
  pace: number;

  @IsInt()
  @Min(1)
  @Max(99)
  shooting: number;

  @IsInt()
  @Min(1)
  @Max(99)
  passing: number;

  @IsInt()
  @Min(1)
  @Max(99)
  dribbling: number;

  @IsInt()
  @Min(1)
  @Max(99)
  defending: number;

  @IsInt()
  @Min(1)
  @Max(99)
  @CrossFieldRule<CreatePlayerDto>(
    (dto) =>
      !(
        dto.pace +
          dto.shooting +
          dto.passing +
          dto.dribbling +
          dto.defending +
          dto.physical >
        MAX_ATTRIBUTES_SUM
      ),
    `the sum of the six attributes must be at most ${MAX_ATTRIBUTES_SUM}`,
  )
  physical: number;

  @IsInt()
  @Min(1)
  @Max(99)
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.potential < highestAttribute(dto)),
    'potential must be at least the highest attribute',
  )
  @CrossFieldRule<CreatePlayerDto>(
    (dto) => !(dto.age >= 33 && dto.potential > highestAttribute(dto)),
    'potential must equal the highest attribute for players aged 33 or older',
  )
  potential: number;
}
