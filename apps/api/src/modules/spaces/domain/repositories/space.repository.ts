import { Space } from '../entities/space.entity';
import { SpaceInvite } from '../entities/space-invite.entity';
import { SpaceMember } from '../entities/space-member.entity';

export abstract class SpaceRepository {
  abstract create(space: Space): Promise<void>;

  abstract findById(id: string): Promise<Space | null>;

  abstract findByCode(code: string): Promise<Space | null>;

  abstract findByMember(userId: string): Promise<Space[]>;

  abstract existsByCode(code: string): Promise<boolean>;

  abstract rename(spaceId: string, name: string): Promise<void>;

  abstract addMember(spaceId: string, member: SpaceMember): Promise<void>;

  abstract removeMember(spaceId: string, userId: string): Promise<void>;

  abstract addInvite(invite: SpaceInvite): Promise<void>;

  abstract updateInvite(invite: SpaceInvite): Promise<void>;
}
