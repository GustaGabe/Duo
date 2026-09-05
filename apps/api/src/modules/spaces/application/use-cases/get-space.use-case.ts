import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Space } from '../../domain/entities/space.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository';

@Injectable()
export class GetSpaceUseCase {
  constructor(private readonly spaces: SpaceRepository) {}

  async execute(spaceId: string, viewerId: string): Promise<Space> {
    const space = await this.spaces.findById(spaceId);

    if (!space) {
      throw new NotFoundException('Espaço não encontrado.');
    }

    if (!space.hasMember(viewerId)) {
      throw new ForbiddenException('Você não participa deste espaço.');
    }

    return space;
  }
}
