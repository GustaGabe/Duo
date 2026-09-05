import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'space_id' })
  spaceId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({ type: 'timestamp' })
  date: Date;
}
