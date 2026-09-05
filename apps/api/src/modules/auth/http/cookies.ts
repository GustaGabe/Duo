import { CookieOptions, Response } from 'express';

export const ACCESS_COOKIE = 'duo_at';
export const REFRESH_COOKIE = 'duo_rt';

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function baseOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

export function setAuthCookies(
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
): void {
  response.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...baseOptions(),
    maxAge: ACCESS_MAX_AGE,
  });
  response.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseOptions(),
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearAuthCookies(response: Response): void {
  response.clearCookie(ACCESS_COOKIE, baseOptions());
  response.clearCookie(REFRESH_COOKIE, baseOptions());
}
