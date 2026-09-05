import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import {
  createSpace,
  inviteToSpace,
  joinSpace,
  leaveSpace,
  listSpaces,
  removeMember,
  renameSpace,
} from '@/api/spaces';
import { spaceTones } from '@/components/spaces/space-mark';
import { useActiveSpaceStore } from '@/lib/active-space';

import { queryKeys } from './queries';

export function useSpaces() {
  return useQuery({ queryKey: queryKeys.spaces, queryFn: listSpaces });
}

export function useActiveSpace() {
  const { data: spaces, isPending } = useSpaces();
  const spaceId = useActiveSpaceStore((state) => state.spaceId);
  const setSpaceId = useActiveSpaceStore((state) => state.setSpaceId);

  const active = spaces?.find((space) => space.id === spaceId) ?? spaces?.[0];
  const tones = useMemo(() => spaceTones(spaces ?? []), [spaces]);

  useEffect(() => {
    if (active && active.id !== spaceId) setSpaceId(active.id);
  }, [active, spaceId, setSpaceId]);

  return { space: active, spaces, tones, isPending, setSpaceId };
}

function invalidateSpaces(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.spaces });
}

export function useCreateSpace() {
  const client = useQueryClient();
  const setSpaceId = useActiveSpaceStore((state) => state.setSpaceId);
  return useMutation({
    mutationFn: createSpace,
    onSuccess: (space) => {
      invalidateSpaces(client);
      setSpaceId(space.id);
    },
  });
}

export function useRenameSpace() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameSpace(id, name),
    onSuccess: () => invalidateSpaces(client),
  });
}

export function useInviteToSpace() {
  const client = useQueryClient();
  return useMutation({ mutationFn: inviteToSpace, onSuccess: () => invalidateSpaces(client) });
}

export function useRemoveMember() {
  const client = useQueryClient();
  return useMutation({ mutationFn: removeMember, onSuccess: () => invalidateSpaces(client) });
}

export function useJoinSpace() {
  const client = useQueryClient();
  const setSpaceId = useActiveSpaceStore((state) => state.setSpaceId);
  return useMutation({
    mutationFn: joinSpace,
    onSuccess: (space) => {
      invalidateSpaces(client);
      setSpaceId(space.id);
    },
  });
}

export function useLeaveSpace() {
  const client = useQueryClient();
  return useMutation({ mutationFn: leaveSpace, onSuccess: () => invalidateSpaces(client) });
}
