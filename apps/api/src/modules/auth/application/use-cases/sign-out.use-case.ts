import { Injectable } from '@nestjs/common';

import { RefreshSessionRepository } from '../../domain/repositories/refresh-session.repository';
import { TokenIssuer } from '../../domain/services/token-issuer';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly refreshSessions: RefreshSessionRepository,
    private readonly tokens: TokenIssuer,
  ) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    const payload = await this.tokens
      .verifyRefreshToken(refreshToken)
      .catch(() => null);

    if (!payload) return;

    const session = await this.refreshSessions.findById(payload.sid);

    if (!session || session.isRevoked) return;

    session.revoke();
    await this.refreshSessions.update(session);
  }
}
