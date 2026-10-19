import { ApiProperty } from '@nestjs/swagger';
import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { PlayerResponseDto } from '../../jogadores/dtos/player-response.dto.js';
import { ClubLineup } from '../interfaces/lineup.interface.js';

export class LineupResponseDto {
  @ApiProperty({ description: 'ID do clube', example: 1 })
  club_id: number;
  @ApiProperty({
    description: 'Formação da escalação, ou null se o clube nunca escalou',
    enum: ClubFormation,
    nullable: true,
    example: ClubFormation.TWO_ONE_ONE,
  })
  formation: ClubFormation | null;
  @ApiProperty({ description: 'true quando a escalação tem os 5 titulares', example: true })
  complete: boolean;
  @ApiProperty({ description: 'Titulares na ordem do elenco, com os campos de GET /players/{id}', type: [PlayerResponseDto] })
  players: PlayerResponseDto[];

  constructor(lineup: ClubLineup) {
    this.club_id = lineup.clubId;
    this.formation = lineup.formation;
    this.complete = lineup.complete;
    this.players = lineup.players.map((player) => new PlayerResponseDto(player));
  }
}
