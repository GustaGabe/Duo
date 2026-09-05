export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public readonly createdAt: Date,
  ) {}

  get initials(): string {
    return this.name.trim().charAt(0).toUpperCase() || '?';
  }
}
