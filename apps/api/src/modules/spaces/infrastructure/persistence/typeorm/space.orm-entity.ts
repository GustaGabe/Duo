import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { SpaceInviteOrmEntity } from './space-invite.orm-entity';
import { SpaceMemberOrmEntity } from './space-member.orm-entity';

@Entity('spaces')
export class SpaceOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  code: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SpaceMemberOrmEntity, (member) => member.space, {
    cascade: ['insert'],
  })
  members: SpaceMemberOrmEntity[];

  @OneToMany(() => SpaceInviteOrmEntity, (invite) => invite.space, {
    cascade: ['insert'],
  })
  invites: SpaceInviteOrmEntity[];
}
