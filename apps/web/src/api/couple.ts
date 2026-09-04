import type { Couple, User } from '@duo/shared';

import { CURRENT_USER_ID, db, nextId } from './mock-db';
import { mockRequest } from './client';

export function getCouple(): Promise<Couple> {
  return mockRequest(() => db.couple);
}

export function getCurrentUser(): Promise<User> {
  return mockRequest(() => {
    const user = db.couple.members.find((member) => member.id === CURRENT_USER_ID);
    if (!user) throw new Error('Signed-in user is missing from the couple.');
    return user;
  });
}

export function sendInvite(email: string): Promise<Couple> {
  return mockRequest(() => {
    db.couple.invites = [
      ...db.couple.invites.filter((invite) => invite.email !== email),
      { id: nextId('inv'), email, status: 'pending', sentAt: new Date().toISOString() },
    ];
    return db.couple;
  });
}
