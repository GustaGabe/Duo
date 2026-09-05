import { Space } from '../../../../domain/entities/space.entity';
import { SpaceInvite } from '../../../../domain/entities/space-invite.entity';
import { SpaceMember } from '../../../../domain/entities/space-member.entity';
import { InviteStatus } from '../../../../domain/enums/invite-status.enum';
import { MemberSlot } from '../../../../domain/enums/member-slot.enum';
import { SpaceRole } from '../../../../domain/enums/space-role.enum';
import { SpaceInviteOrmEntity } from '../space-invite.orm-entity';
import { SpaceMemberOrmEntity } from '../space-member.orm-entity';
import { SpaceOrmEntity } from '../space.orm-entity';

interface MemberRow extends SpaceMemberOrmEntity {
  name?: string;
  email?: string;
}

export class SpaceMapper {
  static toDomain(
    entity: SpaceOrmEntity,
    names: Map<string, { name: string; email: string }>,
  ): Space {
    const members = (entity.members ?? [])
      .map((row: MemberRow) => {
        const user = names.get(row.userId);

        return new SpaceMember(
          row.userId,
          user?.name ?? '—',
          user?.email ?? '',
          row.slot as MemberSlot,
          row.role as SpaceRole,
          row.joinedAt,
        );
      })
      .sort((a, b) => a.slot.localeCompare(b.slot));

    const invites = (entity.invites ?? []).map(
      (row) =>
        new SpaceInvite(
          row.id,
          row.spaceId,
          row.email,
          row.status as InviteStatus,
          row.sentAt,
        ),
    );

    return new Space(
      entity.id,
      entity.name,
      entity.code,
      entity.ownerId,
      members,
      invites,
      entity.createdAt,
    );
  }

  static toPersistence(space: Space): SpaceOrmEntity {
    const entity = new SpaceOrmEntity();

    entity.id = space.id;
    entity.name = space.name;
    entity.code = space.code;
    entity.ownerId = space.ownerId;
    entity.createdAt = space.createdAt;
    entity.members = space.members.map((member) =>
      SpaceMapper.memberToPersistence(space.id, member),
    );
    entity.invites = space.invites.map((invite) =>
      SpaceMapper.inviteToPersistence(invite),
    );

    return entity;
  }

  static memberToPersistence(
    spaceId: string,
    member: SpaceMember,
  ): SpaceMemberOrmEntity {
    const entity = new SpaceMemberOrmEntity();

    entity.spaceId = spaceId;
    entity.userId = member.userId;
    entity.slot = member.slot;
    entity.role = member.role;
    entity.joinedAt = member.joinedAt;

    return entity;
  }

  static inviteToPersistence(invite: SpaceInvite): SpaceInviteOrmEntity {
    const entity = new SpaceInviteOrmEntity();

    entity.id = invite.id;
    entity.spaceId = invite.spaceId;
    entity.email = invite.email;
    entity.status = invite.status;
    entity.sentAt = invite.sentAt;

    return entity;
  }
}
