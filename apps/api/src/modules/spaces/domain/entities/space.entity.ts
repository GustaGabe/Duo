import { SpaceInvite } from './space-invite.entity';
import { SpaceMember } from './space-member.entity';
import { MemberSlot, SLOT_ORDER } from '../enums/member-slot.enum';
import { SpaceRole } from '../enums/space-role.enum';

export class Space {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly code: string,
    public readonly ownerId: string,
    public members: SpaceMember[],
    public invites: SpaceInvite[],
    public readonly createdAt: Date,
  ) {}

  hasMember(userId: string): boolean {
    return this.members.some((member) => member.userId === userId);
  }

  memberOf(userId: string): SpaceMember | undefined {
    return this.members.find((member) => member.userId === userId);
  }

  /** First colour slot nobody is using; falls back to the last one once the space is full. */
  nextFreeSlot(): MemberSlot {
    const taken = new Set(this.members.map((member) => member.slot));

    return SLOT_ORDER.find((slot) => !taken.has(slot)) ?? MemberSlot.D;
  }

  addMember(userId: string, name: string, email: string): SpaceMember {
    const member = new SpaceMember(
      userId,
      name,
      email,
      this.nextFreeSlot(),
      SpaceRole.MEMBER,
      new Date(),
    );

    this.members = [...this.members, member];

    return member;
  }

  removeMember(userId: string): void {
    this.members = this.members.filter((member) => member.userId !== userId);
  }
}
