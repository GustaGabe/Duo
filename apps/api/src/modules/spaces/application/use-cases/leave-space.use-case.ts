import { BadRequestException, Injectable } from '@nestjs/common';

import { SpaceRepository } from '../../domain/repositories/space.repository';
import { GetSpaceUseCase } from './get-space.use-case';

@Injectable()
export class LeaveSpaceUseCase {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly getSpace: GetSpaceUseCase,
  ) {}

  async execute(spaceId: string, viewerId: string): Promise<void> {
    const space = await this.getSpace.execute(spaceId, viewerId);

    if (space.ownerId === viewerId) {
      throw new BadRequestException('O dono não pode sair do próprio espaço.');
    }

    await this.spaces.removeMember(spaceId, viewerId);
  }
}
