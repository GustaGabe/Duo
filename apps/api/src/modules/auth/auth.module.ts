import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case';
import { IssueSessionUseCase } from './application/use-cases/issue-session.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { SignOutUseCase } from './application/use-cases/sign-out.use-case';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { RefreshSessionRepository } from './domain/repositories/refresh-session.repository';
import { PasswordHasher } from './domain/services/password-hasher';
import { TokenIssuer } from './domain/services/token-issuer';
import { AuthController } from './http/controllers/auth.controller';
import { JwtAuthGuard } from './http/guards/jwt-auth.guard';
import { RefreshSessionOrmEntity } from './infrastructure/persistence/typeorm/refresh-session.orm-entity';
import { RefreshSessionTypeOrmRepository } from './infrastructure/persistence/typeorm/refresh-session-typeorm.repository';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';
import { JwtTokenIssuer } from './infrastructure/services/jwt-token-issuer';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshSessionOrmEntity]),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: RefreshSessionRepository,
      useClass: RefreshSessionTypeOrmRepository,
    },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenIssuer, useClass: JwtTokenIssuer },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    IssueSessionUseCase,
    SignUpUseCase,
    SignInUseCase,
    RefreshSessionUseCase,
    SignOutUseCase,
  ],
})
export class AuthModule {}
