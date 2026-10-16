import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubFormation } from '../enums/clubs.enum.js';

@Entity({ name: 'clubes' })
export class Club {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 60 })
  name: string;

  @Column({ name: 'sigla', type: 'char', length: 3 })
  acronym: string;

  @Column({ name: 'caixa', type: 'decimal', precision: 10, scale: 2 })
  cash: string;

  @Column({
    name: 'formacao',
    type: 'enum',
    enum: ClubFormation,
    enumName: 'formacao_clube',
    nullable: true,
  })
  formation: ClubFormation | null;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  createdAt: Date;
}
