import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsInt, Min } from 'class-validator';
import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { LINEUP_SIZE } from '../../escalacoes/constants/lineups.constants.js';

export class UpdateLineupDto {
  @ApiProperty({
    description: 'Formação dos 4 jogadores de linha, por setor, de trás para frente, sem o goleiro (3-1, 2-2, 2-1-1 ou 1-2-1)',
    enum: ClubFormation,
    example: ClubFormation.TWO_ONE_ONE,
  })
  @IsEnum(ClubFormation, { message: 'a formação deve ser um dos valores: 3-1, 2-2, 2-1-1, 1-2-1' })
  formation: ClubFormation;

  @ApiProperty({ description: 'IDs dos 5 titulares do elenco do clube, distintos, em qualquer ordem', type: [Number], example: [34, 31, 30, 33, 32] })
  @IsArray({ message: 'os titulares devem ser uma lista de ids' })
  @ArrayMinSize(LINEUP_SIZE, { message: `os titulares devem ser exatamente ${LINEUP_SIZE} ids` })
  @ArrayMaxSize(LINEUP_SIZE, { message: `os titulares devem ser exatamente ${LINEUP_SIZE} ids` })
  @ArrayUnique({ message: 'os titulares não podem ter ids repetidos' })
  @IsInt({ each: true, message: 'cada titular deve ser um id inteiro' })
  @Min(1, { each: true, message: 'cada titular deve ser um id maior que zero' })
  player_ids: number[];
}
