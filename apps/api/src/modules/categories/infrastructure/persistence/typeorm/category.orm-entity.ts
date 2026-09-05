import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'space_id', type: 'uuid' })
  spaceId: string;

  @Column()
  name: string;

  @Column()
  tag: string;

  @Column()
  description: string;

  @Column()
  kind: string;

  @Column()
  color: string;

  @Column({ name: 'monthly_limit_cents', type: 'integer', nullable: true })
  monthlyLimitCents: number | null;

  @Column()
  scope: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string | null;
}
