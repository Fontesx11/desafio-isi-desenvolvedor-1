import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerCondition, PlayerPosition } from '../../jogadores/enums/players.enum.js';
import { DuelAttribute } from '../enums/matches.enum.js';

@Entity({ name: 'duelos_partida' })
export class MatchDuel {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'partida_id', type: 'integer' })
  matchId: number;

  @Column({ name: 'ordem', type: 'integer' })
  order: number;

  @Column({ name: 'clube_atacante_id', type: 'integer' })
  attackingClubId: number;

  @Column({ name: 'atacante_id', type: 'integer' })
  attackerId: number;

  @Column({ name: 'defensor_id', type: 'integer' })
  defenderId: number;

  @Column({ name: 'nome_atacante', type: 'varchar', length: 100 })
  attackerName: string;

  @Column({ name: 'nome_defensor', type: 'varchar', length: 100 })
  defenderName: string;

  @Column({
    name: 'posicao_atacante',
    type: 'enum',
    enum: PlayerPosition,
    enumName: 'posicao_jogador',
  })
  attackerPosition: PlayerPosition;

  @Column({
    name: 'posicao_defensor',
    type: 'enum',
    enum: PlayerPosition,
    enumName: 'posicao_jogador',
  })
  defenderPosition: PlayerPosition;

  @Column({
    name: 'condicao_atacante',
    type: 'enum',
    enum: PlayerCondition,
    enumName: 'condicao_jogador',
  })
  attackerCondition: PlayerCondition;

  @Column({
    name: 'condicao_defensor',
    type: 'enum',
    enum: PlayerCondition,
    enumName: 'condicao_jogador',
  })
  defenderCondition: PlayerCondition;

  @Column({
    name: 'atributo_ataque',
    type: 'enum',
    enum: DuelAttribute,
    enumName: 'atributo_duelo',
  })
  attackAttribute: DuelAttribute;

  @Column({
    name: 'atributo_defesa',
    type: 'enum',
    enum: DuelAttribute,
    enumName: 'atributo_duelo',
  })
  defenseAttribute: DuelAttribute;

  @Column({ name: 'valor_ataque', type: 'integer' })
  attackValue: number;

  @Column({ name: 'valor_defesa', type: 'integer' })
  defenseValue: number;

  @Column({ name: 'gol', type: 'boolean' })
  goal: boolean;
}
