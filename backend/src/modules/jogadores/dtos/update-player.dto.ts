import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreatePlayerDto } from './create-player.dto.js';
import { IsEnum } from 'class-validator';
import { PlayerCondition } from '../enums/players.enum.js';

export class UpdatePlayerDto extends PickType(CreatePlayerDto, ['name', 'position', 'agility', 'age'] as const) {}

export class UpdatePlayerConditionDto {
  @ApiProperty({
    description: 'Nova condição do jogador. DOENTE não pode voltar direto para APTO',
    enum: PlayerCondition,
    example: PlayerCondition.MAL_CONDICIONADO,
  })
  @IsEnum(PlayerCondition)
  condition: PlayerCondition;
}
