import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { User } from '../../../users/domain/entities/user.entity';
import { RefreshSession } from '../../domain/entities/refresh-session.entity';
import { RefreshSessionRepository } from '../../domain/repositories/refresh-session.repository';
import { TokenIssuer } from '../../domain/services/token-issuer';
import { AuthResult } from '../dto/auth-result';

@Injectable()
export class IssueSessionUseCase {
  constructor(
    private readonly refreshSessions: RefreshSessionRepository,
    private readonly tokens: TokenIssuer,
  ) {}

  async execute(user: User): Promise<AuthResult> {
    const sessionId = randomUUID();
    const now = new Date();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokens.signAccessToken({ sub: user.id }),
      this.tokens.signRefreshToken({ sub: user.id, sid: sessionId }),
    ]);

    await this.refreshSessions.create(
      new RefreshSession(
        sessionId,
        user.id,
        this.tokens.hashToken(refreshToken),
        new Date(now.getTime() + this.tokens.refreshTokenTtlMs),
        now,
      ),
    );

    return { user, tokens: { accessToken, refreshToken } };
  }
}
