export class RefreshSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public tokenHash: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public revokedAt: Date | null = null,
  ) {}

  get isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  isExpired(now: Date = new Date()): boolean {
    return this.expiresAt.getTime() <= now.getTime();
  }

  isUsable(now: Date = new Date()): boolean {
    return !this.isRevoked && !this.isExpired(now);
  }

  revoke(now: Date = new Date()): void {
    this.revokedAt = now;
  }
}
