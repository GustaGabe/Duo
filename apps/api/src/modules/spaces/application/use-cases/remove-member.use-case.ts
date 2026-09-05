import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Space } from '../../domain/entities/space.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { GetSpaceUseCase } from './get-space.use-case';

@Injectable()
export class RemoveMemberUseCase {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly getSpace: GetSpaceUseCase,
  ) {}

  async execute(
    spaceId: string,
    viewerId: string,
    userId: string,
  ): Promise<Space> {
    const space = await this.getSpace.execute(spaceId, viewerId);

    if (space.ownerId !== viewerId) {
      throw new ForbiddenException('Só o dono pode remover pessoas.');
    }

    if (space.ownerId === userId) {
      throw new BadRequestException('O dono não pode sair do próprio espaço.');
    }

    if (!space.hasMember(userId)) {
      throw new BadRequestException('Essa pessoa não está no espaço.');
    }

    await this.spaces.removeMember(spaceId, userId);
    space.removeMember(userId);

    return space;
  }
}
