import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatBrasiliaDateTime } from '../../../core/utils/date.utils.js';
import { ClubFormation } from '../../clubes/enums/clubs.enum.js';
import { PlayerCondition, PlayerPosition } from '../../jogadores/enums/players.enum.js';
import { MatchDuel } from '../entities/match-duel.entity.js';
import { Match } from '../entities/match.entity.js';
import { DuelAttribute, MatchResult } from '../enums/matches.enum.js';

export class MatchClubResponseDto {
  @ApiProperty({ description: 'ID do clube', example: 1 })
  club_id: number;
  @ApiProperty({ description: 'Nome do clube', example: 'Águias FC' })
  club_name: string;
  @ApiProperty({ description: 'Formação do clube na partida', enum: ClubFormation, example: ClubFormation.TWO_ONE_ONE })
  formation: ClubFormation;
  @ApiProperty({ description: 'Gols marcados (0 a 3)', example: 1 })
  goals: number;
}

export class DuelPlayerResponseDto {
  @ApiProperty({ description: 'ID do jogador', example: 34 })
  player_id: number;
  @ApiProperty({ description: 'Nome do jogador no momento da partida', example: 'Otto Rangel' })
  player_name: string;
  @ApiProperty({ description: 'Posição do jogador no momento da partida', enum: PlayerPosition, example: PlayerPosition.ATA })
  position: PlayerPosition;
  @ApiProperty({ description: 'Condição do jogador no momento da partida', enum: PlayerCondition, example: PlayerCondition.APTO })
  condition: PlayerCondition;
  @ApiProperty({
    description: 'Atributo usado: shooting no ATA, passing no MEI e dribbling no ZAG e no LAT; o defensor usa sempre defending',
    enum: DuelAttribute,
    example: DuelAttribute.SHOOTING,
  })
  attribute: DuelAttribute;
  @ApiProperty({ description: 'Valor usado no duelo, já com o efeito da condição', example: 75 })
  value: number;
}

export class MatchDuelResponseDto {
  @ApiProperty({ description: 'Número do duelo: 1 a 3, os ataques do mandante; 4 a 6, os do visitante', example: 1 })
  order: number;
  @ApiProperty({ description: 'ID do clube que ataca', example: 1 })
  attacking_club_id: number;
  @ApiProperty({ description: 'Jogador de linha que ataca', type: DuelPlayerResponseDto })
  attacker: DuelPlayerResponseDto;
  @ApiProperty({
    description: 'Titular do adversário que defende',
    type: DuelPlayerResponseDto,
    example: { player_id: 40, player_name: 'Ivo Teles', position: 'GOL', condition: 'APTO', attribute: 'defending', value: 72 },
  })
  defender: DuelPlayerResponseDto;
  @ApiProperty({ description: 'true quando o valor do ataque é maior que o da defesa', example: true })
  goal: boolean;

  constructor(duel: MatchDuel) {
    this.order = duel.order;
    this.attacking_club_id = duel.attackingClubId;
    this.attacker = {
      player_id: duel.attackerId,
      player_name: duel.attackerName,
      position: duel.attackerPosition,
      condition: duel.attackerCondition,
      attribute: duel.attackAttribute,
      value: duel.attackValue,
    };
    this.defender = {
      player_id: duel.defenderId,
      player_name: duel.defenderName,
      position: duel.defenderPosition,
      condition: duel.defenderCondition,
      attribute: duel.defenseAttribute,
      value: duel.defenseValue,
    };
    this.goal = duel.goal;
  }
}

export class MatchResponseDto {
  @ApiProperty({ description: 'ID da partida', example: 1 })
  id: number;
  @ApiProperty({ description: 'Data e hora da partida (horário de Brasília)', example: '2026-11-12T15:00:00-03:00' })
  played_at: string;
  @ApiProperty({ description: 'Clube mandante', type: MatchClubResponseDto })
  home: MatchClubResponseDto;
  @ApiProperty({
    description: 'Clube visitante',
    type: MatchClubResponseDto,
    example: { club_id: 2, club_name: 'Delta FC', formation: '2-1-1', goals: 2 },
  })
  away: MatchClubResponseDto;
  @ApiProperty({ description: 'Quem marcou mais gols, ou EMPATE', enum: MatchResult, example: MatchResult.VISITANTE })
  result: MatchResult;
  @ApiPropertyOptional({ description: 'Os 6 duelos, na ordem (só na criação e na busca por ID)', type: [MatchDuelResponseDto] })
  duels?: MatchDuelResponseDto[];

  constructor(match: Match, result: MatchResult, duels?: MatchDuel[]) {
    this.id = match.id;
    this.played_at = formatBrasiliaDateTime(match.playedAt);
    this.home = {
      club_id: match.homeClubId,
      club_name: match.homeClub.name,
      formation: match.homeFormation,
      goals: match.homeGoals,
    };
    this.away = {
      club_id: match.awayClubId,
      club_name: match.awayClub.name,
      formation: match.awayFormation,
      goals: match.awayGoals,
    };
    this.result = result;

    if (duels) {
      this.duels = duels.map((duel) => new MatchDuelResponseDto(duel));
    }
  }
}
