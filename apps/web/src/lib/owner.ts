import type { OwnerSlot } from '@duo/shared';

export const ownerSurface: Record<OwnerSlot, string> = {
  a: 'bg-owner-a text-on-owner-a',
  b: 'bg-owner-b text-on-owner-b',
};

export const ownerDot: Record<OwnerSlot, string> = {
  a: 'bg-owner-a',
  b: 'bg-owner-b',
};

export const ownerText: Record<OwnerSlot, string> = {
  a: 'text-owner-a',
  b: 'text-owner-b',
};
