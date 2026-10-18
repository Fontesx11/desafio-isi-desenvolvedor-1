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
import { ClubFormation } from '../../clubes/enums/clubs.enum.js';

@Entity({ name: 'partidas' })
export class Match {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'mandante_id', type: 'integer' })
  homeClubId: number;

  @Column({ name: 'visitante_id', type: 'integer' })
  awayClubId: number;

  @Column({ name: 'gols_mandante', type: 'integer' })
  homeGoals: number;

  @Column({ name: 'gols_visitante', type: 'integer' })
  awayGoals: number;

  @Column({
    name: 'formacao_mandante',
    type: 'enum',
    enum: ClubFormation,
    enumName: 'formacao_clube',
  })
  homeFormation: ClubFormation;

  @Column({
    name: 'formacao_visitante',
    type: 'enum',
    enum: ClubFormation,
    enumName: 'formacao_clube',
  })
  awayFormation: ClubFormation;

  @CreateDateColumn({ name: 'jogada_em', type: 'timestamptz' })
  playedAt: Date;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'mandante_id' })
  homeClub: Relation<Club>;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'visitante_id' })
  awayClub: Relation<Club>;
}
