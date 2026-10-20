import { ApiProperty } from '@nestjs/swagger';
import { ClubStanding } from '../interfaces/standing.interface.js';

export class StandingResponseDto {
  @ApiProperty({ description: 'Posição na classificação, de 1 ao total de clubes, sem repetir', example: 1 })
  position: number;
  @ApiProperty({ description: 'ID do clube', example: 2 })
  club_id: number;
  @ApiProperty({ description: 'Nome do clube', example: 'Delta FC' })
  club_name: string;
  @ApiProperty({ description: 'Partidas jogadas', example: 1 })
  played: number;
  @ApiProperty({ description: 'Vitórias', example: 1 })
  wins: number;
  @ApiProperty({ description: 'Empates', example: 0 })
  draws: number;
  @ApiProperty({ description: 'Derrotas', example: 0 })
  losses: number;
  @ApiProperty({ description: 'Gols marcados', example: 2 })
  goals_for: number;
  @ApiProperty({ description: 'Gols sofridos', example: 1 })
  goals_against: number;
  @ApiProperty({ description: 'Saldo de gols (marcados − sofridos)', example: 1 })
  goal_difference: number;
  @ApiProperty({ description: 'Pontos: vitória 3, empate 1, derrota 0', example: 3 })
  points: number;

  constructor(standing: ClubStanding) {
    this.position = standing.position;
    this.club_id = standing.clubId;
    this.club_name = standing.clubName;
    this.played = standing.played;
    this.wins = standing.wins;
    this.draws = standing.draws;
    this.losses = standing.losses;
    this.goals_for = standing.goalsFor;
    this.goals_against = standing.goalsAgainst;
    this.goal_difference = standing.goalDifference;
    this.points = standing.points;
  }
}
