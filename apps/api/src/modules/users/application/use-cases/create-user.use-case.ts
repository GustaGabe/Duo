import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserInput } from '../dto/create-user.input';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new ConflictException('Já existe uma conta com esse e-mail.');
    }

    const user = new User(
      randomUUID(),
      input.name.trim(),
      email,
      input.passwordHash,
      new Date(),
    );

    await this.userRepository.create(user);

    return user;
  }
}
