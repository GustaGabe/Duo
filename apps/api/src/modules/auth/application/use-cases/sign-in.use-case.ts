import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { AuthResult } from '../dto/auth-result';
import { SignInInput } from '../dto/sign-in.input';
import { IssueSessionUseCase } from './issue-session.use-case';

const INVALID = 'E-mail ou senha incorretos.';

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly issueSession: IssueSessionUseCase,
  ) {}

  async execute(input: SignInInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email.trim().toLowerCase());

    if (!user) {
      await this.hasher.hash(input.password);
      throw new UnauthorizedException(INVALID);
    }

    const matches = await this.hasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!matches) {
      throw new UnauthorizedException(INVALID);
    }

    return this.issueSession.execute(user);
  }
}
