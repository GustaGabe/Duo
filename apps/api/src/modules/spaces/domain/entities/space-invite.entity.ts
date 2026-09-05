import { InviteStatus } from '../enums/invite-status.enum';

export class SpaceInvite {
  constructor(
    public readonly id: string,
    public readonly spaceId: string,
    public readonly email: string,
    public status: InviteStatus,
    public readonly sentAt: Date,
  ) {}

  accept(): void {
    this.status = InviteStatus.ACCEPTED;
  }
}
