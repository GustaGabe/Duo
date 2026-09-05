import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { SpaceOrmEntity } from './space.orm-entity';

@Entity('space_members')
export class SpaceMemberOrmEntity {
  @PrimaryColumn({ name: 'space_id', type: 'uuid' })
  spaceId: string;

  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column()
  slot: string;

  @Column()
  role: string;

  @Column({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;

  @ManyToOne(() => SpaceOrmEntity, (space) => space.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id' })
  space: SpaceOrmEntity;
}
