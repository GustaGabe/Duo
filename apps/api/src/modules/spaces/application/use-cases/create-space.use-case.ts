import { Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'node:crypto';

import { User } from '../../../users/domain/entities/user.entity';
import { Space } from '../../domain/entities/space.entity';
import { SpaceMember } from '../../domain/entities/space-member.entity';
import { MemberSlot } from '../../domain/enums/member-slot.enum';
import { SpaceRole } from '../../domain/enums/space-role.enum';
import { SpaceRepository } from '../../domain/repositories/space.repository';

/** No I, O, 0 or 1 — a code gets read out loud and typed by hand. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class CreateSpaceUseCase {
  constructor(private readonly spaces: SpaceRepository) {}

  async execute(owner: User, name: string): Promise<Space> {
    const now = new Date();

    const space = new Space(
      randomUUID(),
      name.trim(),
      await this.uniqueCode(),
      owner.id,
      [
        new SpaceMember(
          owner.id,
          owner.name,
          owner.email,
          MemberSlot.A,
          SpaceRole.OWNER,
          now,
        ),
      ],
      [],
      now,
    );

    await this.spaces.create(space);

    return space;
  }

  private async uniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const suffix = Array.from(
        { length: 4 },
        () => ALPHABET[randomInt(ALPHABET.length)],
      ).join('');
      const code = `DUO-${suffix}`;

      if (!(await this.spaces.existsByCode(code))) return code;
    }

    return `DUO-${randomUUID().slice(0, 4).toUpperCase()}`;
  }
}
