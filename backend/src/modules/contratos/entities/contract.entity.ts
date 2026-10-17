import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Club } from '../../clubes/entities/club.entity.js';
import { Player } from '../../jogadores/entities/player.entity.js';
import { ContractStatus } from '../enums/contracts.enum.js';

@Entity({ name: 'contratos' })
export class Contract {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'jogador_id', type: 'integer' })
  playerId: number;

  @Column({ name: 'clube_id', type: 'integer' })
  clubId: number;

  @Column({ name: 'valor_compra', type: 'decimal', precision: 6, scale: 2 })
  purchaseValue: string;

  @Column({ name: 'fidelidade_ate', type: 'timestamptz' })
  loyaltyUntil: Date;

  @Column({
    name: 'situacao',
    type: 'enum',
    enum: ContractStatus,
    enumName: 'situacao_contrato',
  })
  status: ContractStatus;

  @CreateDateColumn({ name: 'iniciado_em', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'encerrado_em', type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'jogador_id' })
  player?: Relation<Player>;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'clube_id' })
  club?: Relation<Club>;
}
