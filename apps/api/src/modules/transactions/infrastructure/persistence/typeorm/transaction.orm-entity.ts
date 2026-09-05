import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'space_id', type: 'uuid' })
  spaceId: string;

  @Column()
  kind: string;

  @Column()
  description: string;

  @Column({ name: 'amount_cents', type: 'integer' })
  amountCents: number;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ name: 'payer_id', type: 'uuid' })
  payerId: string;

  @Column()
  split: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  recurring: boolean;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
