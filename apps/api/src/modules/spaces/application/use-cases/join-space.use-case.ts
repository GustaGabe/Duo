import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../../../users/domain/entities/user.entity';
import { Space } from '../../domain/entities/space.entity';
import { InviteStatus } from '../../domain/enums/invite-status.enum';
import { SLOT_ORDER } from '../../domain/enums/member-slot.enum';
import { SpaceRepository } from '../../domain/repositories/space.repository';

@Injectable()
export class JoinSpaceUseCase {
  constructor(private readonly spaces: SpaceRepository) {}

  async execute(user: User, rawCode: string): Promise<Space> {
    const code = rawCode.trim().toUpperCase();
    const space = await this.spaces.findByCode(code);

    if (!space) {
      throw new NotFoundException('Nenhum espaço com esse código.');
    }

    if (space.hasMember(user.id)) {
      return space;
    }

    if (space.members.length >= SLOT_ORDER.length) {
      throw new BadRequestException(
        `Este espaço já tem ${SLOT_ORDER.length} pessoas, que é o máximo.`,
      );
    }

    const member = space.addMember(user.id, user.name, user.email);
    await this.spaces.addMember(space.id, member);

    const invite = space.invites.find(
      (candidate) =>
        candidate.email === user.email &&
        candidate.status === InviteStatus.PENDING,
    );

    if (invite) {
      invite.accept();
      await this.spaces.updateInvite(invite);
    }

    return space;
  }
}
