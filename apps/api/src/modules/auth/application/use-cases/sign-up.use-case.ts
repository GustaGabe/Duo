import { Injectable } from '@nestjs/common';

import { CreateSpaceUseCase } from '../../../spaces/application/use-cases/create-space.use-case';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { AuthResult } from '../dto/auth-result';
import { SignUpInput } from '../dto/sign-up.input';
import { IssueSessionUseCase } from './issue-session.use-case';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly createSpace: CreateSpaceUseCase,
    private readonly hasher: PasswordHasher,
    private readonly issueSession: IssueSessionUseCase,
  ) {}

  async execute(input: SignUpInput): Promise<AuthResult> {
    const passwordHash = await this.hasher.hash(input.password);

    const user = await this.createUser.execute({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    await this.createSpace.execute(user, user.name.split(' ')[0] ?? user.name);

    return this.issueSession.execute(user);
  }
}
