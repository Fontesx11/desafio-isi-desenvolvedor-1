import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ClubSort } from '../enums/clubs.enum.js';

export class ListClubsQueryDto {
  @ApiPropertyOptional({ description: 'Critério de ordenação', enum: ClubSort, default: ClubSort.NAME })
  @IsEnum(ClubSort, { message: 'a ordenação deve ser um dos valores: name, net_worth_asc, net_worth_desc' })
  sort: ClubSort = ClubSort.NAME;
}
