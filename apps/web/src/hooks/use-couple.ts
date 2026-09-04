import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCouple, getCurrentUser, sendInvite } from '@/api/couple';

import { queryKeys } from './queries';

export function useCouple() {
  return useQuery({ queryKey: queryKeys.couple, queryFn: getCouple });
}

export function useCurrentUser() {
  return useQuery({ queryKey: queryKeys.currentUser, queryFn: getCurrentUser });
}

export function useSendInvite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: sendInvite,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.couple }),
  });
}
