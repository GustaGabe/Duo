import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { User } from '../../../users/domain/entities/user.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { TokenIssuer } from '../../domain/services/token-issuer';
import { ACCESS_COOKIE } from '../cookies';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenIssuer,
    private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const token = (request.cookies as Record<string, string> | undefined)?.[
      ACCESS_COOKIE
    ];

    if (!token) {
      throw new UnauthorizedException('Sessão expirada. Entre novamente.');
    }

    const payload = await this.tokens.verifyAccessToken(token).catch(() => {
      throw new UnauthorizedException('Sessão expirada. Entre novamente.');
    });

    const user = await this.users.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Sessão expirada. Entre novamente.');
    }

    request.user = user;

    return true;
  }
}
