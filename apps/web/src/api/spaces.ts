import type { CreateSpaceInput, Space } from '@duo/shared';

import { request } from './http';

export function listSpaces(): Promise<Space[]> {
  return request<Space[]>('/spaces');
}

export function getSpace(id: string): Promise<Space> {
  return request<Space>(`/spaces/${id}`);
}

export function createSpace(input: CreateSpaceInput): Promise<Space> {
  return request<Space>('/spaces', { method: 'POST', body: input });
}

export function joinSpace(code: string): Promise<Space> {
  return request<Space>('/spaces/join', { method: 'POST', body: { code } });
}

export function renameSpace(id: string, name: string): Promise<Space> {
  return request<Space>(`/spaces/${id}`, { method: 'PATCH', body: { name } });
}

export function inviteToSpace({
  spaceId,
  email,
}: {
  spaceId: string;
  email: string;
}): Promise<Space> {
  return request<Space>(`/spaces/${spaceId}/invites`, { method: 'POST', body: { email } });
}

export function removeMember({
  spaceId,
  userId,
}: {
  spaceId: string;
  userId: string;
}): Promise<Space> {
  return request<Space>(`/spaces/${spaceId}/members/${userId}`, { method: 'DELETE' });
}

export function leaveSpace(spaceId: string): Promise<void> {
  return request<void>(`/spaces/${spaceId}/members/me`, { method: 'DELETE' });
}
