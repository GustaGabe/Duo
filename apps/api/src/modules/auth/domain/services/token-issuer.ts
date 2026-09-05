export interface AccessTokenPayload {
  sub: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
}

export abstract class TokenIssuer {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;

  abstract signRefreshToken(payload: RefreshTokenPayload): Promise<string>;

  abstract verifyAccessToken(token: string): Promise<AccessTokenPayload>;

  abstract verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;

  abstract hashToken(token: string): string;

  abstract get refreshTokenTtlMs(): number;
}
