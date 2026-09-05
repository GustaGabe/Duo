import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { RefreshSessionRepository } from '../../domain/repositories/refresh-session.repository';
import { TokenIssuer } from '../../domain/services/token-issuer';
import { AuthResult } from '../dto/auth-result';
import { IssueSessionUseCase } from './issue-session.use-case';

const INVALID = 'Sessão inválida. Entre novamente.';

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    private readonly refreshSessions: RefreshSessionRepository,
    private readonly users: UserRepository,
    private readonly tokens: TokenIssuer,
    private readonly issueSession: IssueSessionUseCase,
  ) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    const payload = await this.tokens
      .verifyRefreshToken(refreshToken)
      .catch(() => {
        throw new UnauthorizedException(INVALID);
      });

    const session = await this.refreshSessions.findById(payload.sid);

    if (!session || session.userId !== payload.sub) {
      throw new UnauthorizedException(INVALID);
    }

    if (session.tokenHash !== this.tokens.hashToken(refreshToken)) {
      await this.refreshSessions.revokeAllForUser(session.userId);
      throw new UnauthorizedException(INVALID);
    }

    if (!session.isUsable()) {
      if (session.isRevoked) {
        await this.refreshSessions.revokeAllForUser(session.userId);
      }
      throw new UnauthorizedException(INVALID);
    }

    session.revoke();
    await this.refreshSessions.update(session);

    const user = await this.users.findById(session.userId);

    if (!user) {
      throw new UnauthorizedException(INVALID);
    }

    return this.issueSession.execute(user);
  }
}
