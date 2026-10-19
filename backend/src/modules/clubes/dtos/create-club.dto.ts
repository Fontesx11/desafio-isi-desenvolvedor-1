import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { countWords } from '../../../core/utils/string.utils.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import { acronymMatchesName, hasDifferentLetters } from '../utils/clubs.validation.js';

const MIN_WORDS = 2;
const MAX_WORDS = 5;
const ACRONYM_PATTERN = /^[A-Z]{3}$/;

export class CreateClubDto {
  @ApiProperty({ description: 'Nome do clube (3 a 60 caracteres, de 2 a 5 palavras, apenas letras, espaços, hífens e pontos)', example: 'Raimon Eleven' })
  @NormalizeSpaces()
  @IsString({ message: 'o nome deve ser um texto' })
  @Length(3, 60, { message: 'o nome deve ter entre 3 e 60 caracteres' })
  @Matches(/^[\p{L} .-]*$/u, {
    message: 'o nome deve conter apenas letras, espaços, hífens e pontos',
  })
  @CrossFieldRule<CreateClubDto>(
    (dto) => typeof dto.name !== 'string' || (countWords(dto.name) >= MIN_WORDS && countWords(dto.name) <= MAX_WORDS),
    `o nome deve ter entre ${MIN_WORDS} e ${MAX_WORDS} palavras`,
  )
  name: string;

  @ApiProperty({
    description: 'Sigla do clube: 3 letras maiúsculas, não todas iguais, que aparecem em ordem no nome começando pela primeira letra',
    example: 'RAI',
  })
  @IsString({ message: 'a sigla deve ser um texto' })
  @Matches(ACRONYM_PATTERN, {
    message: 'a sigla deve ter exatamente 3 letras maiúsculas de A a Z',
  })
  @CrossFieldRule<CreateClubDto>(
    (dto) => !ACRONYM_PATTERN.test(dto.acronym) || hasDifferentLetters(dto.acronym),
    'as letras da sigla não podem ser todas iguais',
  )
  @CrossFieldRule<CreateClubDto>(
    (dto) => typeof dto.name !== 'string' || !ACRONYM_PATTERN.test(dto.acronym) || acronymMatchesName(dto.acronym, dto.name),
    'as letras da sigla devem aparecer no nome do clube, em ordem, começando pela primeira letra',
  )
  acronym: string;
}
