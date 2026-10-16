import { IsEnum } from 'class-validator';
import { ClubSort } from '../enums/clubs.enum.js';

export class ListClubsQueryDto {
  @IsEnum(ClubSort)
  sort: ClubSort = ClubSort.NAME;
}
