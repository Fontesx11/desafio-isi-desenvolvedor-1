import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '../../../core/dtos/pagination-query.dto.js';
import { PlayerSort } from '../enums/players.enum.js';

export class ListPlayersQueryDto extends PaginationQueryDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @ArrayMaxSize(2)
  @ArrayUnique((option: PlayerSort) => option.split('_')[0])
  @IsEnum(PlayerSort, { each: true })
  sort: PlayerSort[] = [PlayerSort.NAME];
}
