import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '../../../users/domain/entities/user.entity';
import { SpaceRepository } from '../../domain/repositories/space.repository';

/**
 * Reads the space id from the route, the query or the body, and refuses anyone who is not a
 * member. Without it, being logged in would be enough to read someone else's space.
 */
@Injectable()
export class SpaceMemberGuard implements CanActivate {
  constructor(private readonly spaces: SpaceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & {
        user?: User;
        params: Record<string, string>;
        body?: unknown;
      }
    >();

    const body = (request.body ?? {}) as Record<string, unknown>;
    const spaceId =
      request.params.spaceId ??
      request.params.id ??
      (request.query.spaceId as string | undefined) ??
      (typeof body.spaceId === 'string' ? body.spaceId : undefined);

    if (!spaceId || !request.user) {
      throw new ForbiddenException('Informe o espaço.');
    }

    const space = await this.spaces.findById(spaceId);

    if (!space?.hasMember(request.user.id)) {
      throw new ForbiddenException('Você não participa deste espaço.');
    }

    return true;
  }
}
