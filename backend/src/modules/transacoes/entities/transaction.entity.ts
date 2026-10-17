import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transactions.enum.js';

@Entity({ name: 'transacoes' })
export class Transaction {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'clube_id', type: 'integer' })
  clubId: number;

  @Column({ name: 'jogador_id', type: 'integer' })
  playerId: number;

  @Column({ name: 'nome_jogador', type: 'varchar', length: 100 })
  playerName: string;

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: TransactionType,
    enumName: 'tipo_transacao',
  })
  type: TransactionType;

  @Column({ name: 'valor', type: 'decimal', precision: 6, scale: 2 })
  value: string;

  @Column({ name: 'taxa', type: 'decimal', precision: 6, scale: 2 })
  fee: string;

  @Column({ name: 'multa', type: 'decimal', precision: 6, scale: 2 })
  penalty: string;

  @Column({
    name: 'lucro',
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
  })
  profit: string | null;

  @Column({ name: 'variacao_caixa', type: 'decimal', precision: 8, scale: 2 })
  cashChange: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  createdAt: Date;
}
