import { Space } from '../../domain/entities/space.entity';

export function presentSpace(space: Space) {
  return {
    id: space.id,
    name: space.name,
    code: space.code,
    ownerId: space.ownerId,
    createdAt: space.createdAt.toISOString(),
    members: space.members.map((member) => ({
      id: member.userId,
      name: member.name,
      email: member.email,
      initials: member.initials,
      slot: member.slot,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
    })),
    invites: space.invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      status: invite.status,
      sentAt: invite.sentAt.toISOString(),
    })),
  };
}
