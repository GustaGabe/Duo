import type { CreateSpaceInput, Space, User } from '@duo/shared';

import { CURRENT_USER_ID, db, nextId } from './mock-db';
import { mockRequest } from './client';

function randomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from(
    { length: 4 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('');
  return `DUO-${suffix}`;
}

export function getCurrentUser(): Promise<User> {
  return mockRequest(() => {
    const user = db.users.find((candidate) => candidate.id === CURRENT_USER_ID);
    if (!user) throw new Error('Signed-in user is missing.');
    return user;
  });
}

export function listSpaces(): Promise<Space[]> {
  return mockRequest(() =>
    db.spaces.filter((space) => space.members.some((member) => member.id === CURRENT_USER_ID)),
  );
}

export function getSpace(id: string): Promise<Space> {
  return mockRequest(() => {
    const space = db.spaces.find((candidate) => candidate.id === id);
    if (!space) throw new Error(`Space ${id} not found.`);
    return space;
  });
}

export function createSpace(input: CreateSpaceInput): Promise<Space> {
  return mockRequest(() => {
    const owner = db.users.find((candidate) => candidate.id === CURRENT_USER_ID);
    if (!owner) throw new Error('Signed-in user is missing.');

    const space: Space = {
      id: nextId('spc'),
      name: input.name,
      code: randomCode(),
      ownerId: owner.id,
      createdAt: new Date().toISOString(),
      members: [{ ...owner, slot: 'a', role: 'owner', joinedAt: new Date().toISOString() }],
      invites: [],
    };

    db.spaces = [...db.spaces, space];
    return space;
  });
}

export function renameSpace(id: string, name: string): Promise<Space> {
  return mockRequest(() => {
    const index = db.spaces.findIndex((space) => space.id === id);
    if (index < 0) throw new Error(`Space ${id} not found.`);
    const updated = { ...db.spaces[index]!, name };
    db.spaces = db.spaces.with(index, updated);
    return updated;
  });
}

export function inviteToSpace({
  spaceId,
  email,
}: {
  spaceId: string;
  email: string;
}): Promise<Space> {
  return mockRequest(() => {
    const index = db.spaces.findIndex((space) => space.id === spaceId);
    if (index < 0) throw new Error(`Space ${spaceId} not found.`);

    const space = db.spaces[index]!;
    const updated: Space = {
      ...space,
      invites: [
        ...space.invites.filter((invite) => invite.email !== email),
        { id: nextId('inv'), email, status: 'pending', sentAt: new Date().toISOString() },
      ],
    };

    db.spaces = db.spaces.with(index, updated);
    return updated;
  });
}

export function removeMember({
  spaceId,
  userId,
}: {
  spaceId: string;
  userId: string;
}): Promise<Space> {
  return mockRequest(() => {
    const index = db.spaces.findIndex((space) => space.id === spaceId);
    if (index < 0) throw new Error(`Space ${spaceId} not found.`);

    const space = db.spaces[index]!;
    if (space.ownerId === userId) throw new Error('The owner cannot be removed.');

    const updated: Space = {
      ...space,
      members: space.members.filter((member) => member.id !== userId),
    };

    db.spaces = db.spaces.with(index, updated);
    return updated;
  });
}

export function leaveSpace(spaceId: string): Promise<void> {
  return mockRequest(() => {
    const index = db.spaces.findIndex((space) => space.id === spaceId);
    if (index < 0) return;
    const space = db.spaces[index]!;
    if (space.ownerId === CURRENT_USER_ID) throw new Error('The owner cannot leave the space.');
    db.spaces = db.spaces.with(index, {
      ...space,
      members: space.members.filter((member) => member.id !== CURRENT_USER_ID),
    });
  });
}
