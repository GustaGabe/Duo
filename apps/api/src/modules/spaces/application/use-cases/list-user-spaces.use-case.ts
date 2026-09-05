import { Injectable } from '@nestjs/common';

import { Space } from '../../domain/entities/space.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository';

@Injectable()
export class ListUserSpacesUseCase {
  constructor(private readonly spaces: SpaceRepository) {}

  execute(userId: string): Promise<Space[]> {
    return this.spaces.findByMember(userId);
  }
}
