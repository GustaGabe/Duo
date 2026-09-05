import { MemberSlot } from '../enums/member-slot.enum';
import { SpaceRole } from '../enums/space-role.enum';

export class SpaceMember {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
    public slot: MemberSlot,
    public role: SpaceRole,
    public readonly joinedAt: Date,
  ) {}

  get initials(): string {
    return this.name.trim().charAt(0).toUpperCase() || '?';
  }

  isOwner(): boolean {
    return this.role === SpaceRole.OWNER;
  }
}
