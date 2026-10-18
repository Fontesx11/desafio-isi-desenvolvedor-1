import { IsString, Length, Matches } from 'class-validator';
import { NormalizeSpaces } from '../../../core/transformers/normalize-spaces.decorator.js';
import { countWords } from '../../../core/utils/string.utils.js';
import { CrossFieldRule } from '../../../core/validators/cross-field-rule.decorator.js';
import { acronymMatchesName, hasDifferentLetters } from '../utils/clubs.validation.js';

const MIN_WORDS = 2;
const MAX_WORDS = 5;
const ACRONYM_PATTERN = /^[A-Z]{3}$/;

export class CreateClubDto {
  @NormalizeSpaces()
  @IsString()
  @Length(3, 60)
  @Matches(/^[\p{L} .-]*$/u, {
    message: 'name must contain only letters, spaces, hyphens and dots',
  })
  @CrossFieldRule<CreateClubDto>(
    (dto) => typeof dto.name !== 'string' || (countWords(dto.name) >= MIN_WORDS && countWords(dto.name) <= MAX_WORDS),
    `name must have between ${MIN_WORDS} and ${MAX_WORDS} words`,
  )
  name: string;

  @IsString()
  @Matches(ACRONYM_PATTERN, {
    message: 'acronym must have exactly 3 uppercase letters from A to Z',
  })
  @CrossFieldRule<CreateClubDto>((dto) => !ACRONYM_PATTERN.test(dto.acronym) || hasDifferentLetters(dto.acronym), 'acronym letters must not all be the same')
  @CrossFieldRule<CreateClubDto>(
    (dto) => typeof dto.name !== 'string' || !ACRONYM_PATTERN.test(dto.acronym) || acronymMatchesName(dto.acronym, dto.name),
    'acronym letters must appear in the club name in order, starting with its first letter',
  )
  acronym: string;
}
