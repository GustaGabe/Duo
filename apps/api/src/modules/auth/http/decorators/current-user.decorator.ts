import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { User } from '../../../users/domain/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();

    if (!request.user) {
      throw new Error(
        'CurrentUser used on a route that is not protected by JwtAuthGuard.',
      );
    }

    return request.user;
  },
);
