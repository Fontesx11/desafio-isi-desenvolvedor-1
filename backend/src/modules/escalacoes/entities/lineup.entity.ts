import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';
import { Club } from '../../clubes/entities/club.entity.js';
import { Player } from '../../jogadores/entities/player.entity.js';

@Entity({ name: 'escalacoes' })
export class Lineup {
  @PrimaryColumn({ name: 'clube_id', type: 'integer' })
  clubId: number;

  @PrimaryColumn({ name: 'jogador_id', type: 'integer' })
  playerId: number;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'clube_id' })
  club?: Relation<Club>;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'jogador_id' })
  player?: Relation<Player>;
}
