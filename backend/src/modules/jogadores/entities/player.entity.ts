import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerCondition, PlayerPosition } from '../enums/players.enum.js';

@Entity({ name: 'jogadores' })
export class Player {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'posicao', type: 'varchar', length: 3 })
  position: PlayerPosition;

  @Column({ name: 'agilidade', type: 'integer' })
  agility: number;

  @Column({ name: 'idade', type: 'integer' })
  age: number;

  @Column({ name: 'valor_base', type: 'decimal', precision: 6, scale: 2 })
  baseValue: string;

  @Column({ name: 'condicao', type: 'varchar', length: 20 })
  condition: PlayerCondition;

  @Column({ name: 'clube_id', type: 'integer', nullable: true })
  clubId: number | null;

  @Column({ name: 'velocidade', type: 'integer' })
  pace: number;

  @Column({ name: 'finalizacao', type: 'integer' })
  shooting: number;

  @Column({ name: 'passe', type: 'integer' })
  passing: number;

  @Column({ name: 'drible', type: 'integer' })
  dribbling: number;

  @Column({ name: 'defesa', type: 'integer' })
  defending: number;

  @Column({ name: 'fisico', type: 'integer' })
  physical: number;

  @Column({ name: 'potencial', type: 'integer' })
  potential: number;

  @DeleteDateColumn({ name: 'excluido_em', type: 'timestamptz' })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamptz' })
  updatedAt: Date;
}
