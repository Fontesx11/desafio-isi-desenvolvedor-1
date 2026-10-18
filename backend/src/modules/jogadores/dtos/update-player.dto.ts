import { PickType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto.js';
import { IsEnum } from 'class-validator';
import { PlayerCondition } from '../enums/players.enum.js';

export class UpdatePlayerDto extends PickType(CreatePlayerDto, ['name', 'position', 'agility', 'age'] as const) {}

export class UpdatePlayerConditionDto {
  @IsEnum(PlayerCondition)
  condition: PlayerCondition;
}
