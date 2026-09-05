import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/user.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/user-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    { provide: UserRepository, useClass: UserTypeOrmRepository },
    CreateUserUseCase,
    GetUserUseCase,
  ],
  exports: [UserRepository, CreateUserUseCase, GetUserUseCase],
})
export class UsersModule {}
