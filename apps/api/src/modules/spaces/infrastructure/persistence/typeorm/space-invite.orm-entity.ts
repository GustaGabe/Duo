import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { SpaceOrmEntity } from './space.orm-entity';

@Entity('space_invites')
export class SpaceInviteOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'space_id', type: 'uuid' })
  spaceId: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @Column({ name: 'sent_at', type: 'timestamptz' })
  sentAt: Date;

  @ManyToOne(() => SpaceOrmEntity, (space) => space.invites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id' })
  space: SpaceOrmEntity;
}
