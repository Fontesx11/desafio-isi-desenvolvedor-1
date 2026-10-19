import { ApiProperty } from '@nestjs/swagger';
import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';
import { PlayerWithDynamicValues } from '../interfaces/player.interface.js';

export class PlayerResponseDto {
  @ApiProperty({ description: 'ID do jogador', example: 1 })
  id: number;
  @ApiProperty({ description: 'Nome do jogador', example: 'Mark Evans' })
  name: string;
  @ApiProperty({ description: 'Posição do jogador', enum: PlayerPosition, example: PlayerPosition.GOL })
  position: PlayerPosition;
  @ApiProperty({ description: 'Agilidade', example: 80 })
  agility: number;
  @ApiProperty({ description: 'Idade', example: 20 })
  age: number;
  @ApiProperty({ description: 'Condição física', enum: PlayerCondition, example: PlayerCondition.APTO })
  condition: PlayerCondition;
  @ApiProperty({ description: 'Valor base, calculado a partir dos atributos', example: 120.5 })
  base_value: number;
  @ApiProperty({ description: 'Valor de mercado, ajustado pela condição', example: 120.5 })
  market_value: number;
  @ApiProperty({ description: 'Velocidade', example: 70 })
  pace: number;
  @ApiProperty({ description: 'Finalização', example: 50 })
  shooting: number;
  @ApiProperty({ description: 'Passe', example: 75 })
  passing: number;
  @ApiProperty({ description: 'Drible', example: 60 })
  dribbling: number;
  @ApiProperty({ description: 'Defesa', example: 90 })
  defending: number;
  @ApiProperty({ description: 'Físico', example: 85 })
  physical: number;
  @ApiProperty({ description: 'Potencial', example: 95 })
  potential: number;
  @ApiProperty({ description: 'Média geral dos atributos', example: 72 })
  overall: number;
  @ApiProperty({ description: 'ID do clube, ou null se o jogador estiver livre', type: Number, nullable: true, example: null })
  club_id: number | null;

  constructor(player: PlayerWithDynamicValues) {
    this.id = player.id;
    this.name = player.name;
    this.position = player.position;
    this.agility = player.agility;
    this.age = player.age;
    this.condition = player.condition;
    this.base_value = Number(player.baseValue);
    this.market_value = player.marketValue;
    this.pace = player.pace;
    this.shooting = player.shooting;
    this.passing = player.passing;
    this.dribbling = player.dribbling;
    this.defending = player.defending;
    this.physical = player.physical;
    this.potential = player.potential;
    this.overall = player.overall;
    this.club_id = player.clubId;
  }
}
