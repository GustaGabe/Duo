import type { SessionUser, SignInInput, SignUpInput } from '@duo/shared';

import { request } from './http';

export function signUp(input: SignUpInput): Promise<SessionUser> {
  return request<SessionUser>('/auth/sign-up', { method: 'POST', body: input });
}

export function signIn(input: SignInInput): Promise<SessionUser> {
  return request<SessionUser>('/auth/sign-in', { method: 'POST', body: input });
}

export function signOut(): Promise<void> {
  return request<void>('/auth/sign-out', { method: 'POST', retryOnUnauthorized: false });
}

export function getSession(): Promise<SessionUser> {
  return request<SessionUser>('/auth/me');
}
