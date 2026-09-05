import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { User } from '../../../users/domain/entities/user.entity';
import { SignInDto } from '../../application/dto/sign-in.input';
import { SignUpDto } from '../../application/dto/sign-up.input';
import { RefreshSessionUseCase } from '../../application/use-cases/refresh-session.use-case';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { SignOutUseCase } from '../../application/use-cases/sign-out.use-case';
import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from '../cookies';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: user.initials,
  };
}

function readRefreshCookie(request: Request): string | undefined {
  return (request.cookies as Record<string, string> | undefined)?.[
    REFRESH_COOKIE
  ];
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly signOutUseCase: SignOutUseCase,
  ) {}

  @Public()
  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionUser> {
    const { user, tokens } = await this.signUpUseCase.execute(dto);

    setAuthCookies(response, tokens);

    return toSessionUser(user);
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionUser> {
    const { user, tokens } = await this.signInUseCase.execute(dto);

    setAuthCookies(response, tokens);

    return toSessionUser(user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SessionUser> {
    const refreshToken = readRefreshCookie(request);

    try {
      const { user, tokens } = await this.refreshSessionUseCase.execute(
        refreshToken ?? '',
      );

      setAuthCookies(response, tokens);

      return toSessionUser(user);
    } catch (error) {
      clearAuthCookies(response);
      throw error;
    }
  }

  @Public()
  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.signOutUseCase.execute(readRefreshCookie(request));

    clearAuthCookies(response);
  }

  @Get('me')
  me(@CurrentUser() user: User): SessionUser {
    return toSessionUser(user);
  }
}
