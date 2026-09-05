import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Space } from '../../domain/entities/space.entity';
import { SpaceInvite } from '../../domain/entities/space-invite.entity';
import { InviteStatus } from '../../domain/enums/invite-status.enum';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { GetSpaceUseCase } from './get-space.use-case';

@Injectable()
export class InviteToSpaceUseCase {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly getSpace: GetSpaceUseCase,
  ) {}

  async execute(
    spaceId: string,
    viewerId: string,
    rawEmail: string,
  ): Promise<Space> {
    const space = await this.getSpace.execute(spaceId, viewerId);
    const email = rawEmail.trim().toLowerCase();

    if (space.members.some((member) => member.email === email)) {
      throw new BadRequestException('Essa pessoa já está no espaço.');
    }

    const existing = space.invites.find(
      (invite) =>
        invite.email === email && invite.status === InviteStatus.PENDING,
    );

    if (existing) return space;

    const invite = new SpaceInvite(
      randomUUID(),
      space.id,
      email,
      InviteStatus.PENDING,
      new Date(),
    );

    await this.spaces.addInvite(invite);
    space.invites = [...space.invites, invite];

    return space;
  }
}
