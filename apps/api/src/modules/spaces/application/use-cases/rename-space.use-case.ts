import { ForbiddenException, Injectable } from '@nestjs/common';

import { Space } from '../../domain/entities/space.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { GetSpaceUseCase } from './get-space.use-case';

@Injectable()
export class RenameSpaceUseCase {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly getSpace: GetSpaceUseCase,
  ) {}

  async execute(
    spaceId: string,
    viewerId: string,
    name: string,
  ): Promise<Space> {
    const space = await this.getSpace.execute(spaceId, viewerId);

    if (space.ownerId !== viewerId) {
      throw new ForbiddenException('Só o dono pode renomear o espaço.');
    }

    space.name = name.trim();
    await this.spaces.rename(space.id, space.name);

    return space;
  }
}
