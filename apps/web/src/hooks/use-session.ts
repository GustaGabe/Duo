import type { SessionUser } from '@duo/shared';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getSession, signIn, signOut, signUp } from '@/api/auth';
import { HttpError } from '@/api/http';

import { queryKeys } from './queries';

export async function loadSession(queryClient: QueryClient): Promise<SessionUser | null> {
  try {
    return await queryClient.ensureQueryData({
      queryKey: queryKeys.session,
      queryFn: getSession,
      retry: false,
    });
  } catch {
    queryClient.setQueryData(queryKeys.session, null);
    return null;
  }
}

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    retry: false,
    staleTime: 60_000,
  });
}

export function useSignIn() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (user) => client.setQueryData(queryKeys.session, user),
  });
}

export function useSignUp() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (user) => client.setQueryData(queryKeys.session, user),
  });
}

export function useSignOut() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSettled: () => client.clear(),
  });
}

export function errorMessage(error: unknown): string | null {
  if (error instanceof HttpError) return error.message;
  if (error) return 'Não foi possível concluir. Tente de novo.';
  return null;
}
