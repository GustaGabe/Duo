import type { MemberSlot } from '@duo/shared';

export const ownerSurface: Record<MemberSlot, string> = {
  a: 'bg-owner-a text-on-owner-a',
  b: 'bg-owner-b text-on-owner-b',
  c: 'bg-owner-c text-on-owner-c',
  d: 'bg-owner-d text-on-owner-d',
};

export const ownerDot: Record<MemberSlot, string> = {
  a: 'bg-owner-a',
  b: 'bg-owner-b',
  c: 'bg-owner-c',
  d: 'bg-owner-d',
};

export const ownerBar: Record<MemberSlot, string> = ownerDot;

export const SLOTS: MemberSlot[] = ['a', 'b', 'c', 'd'];

export function nextSlot(taken: MemberSlot[]): MemberSlot {
  return SLOTS.find((slot) => !taken.includes(slot)) ?? 'd';
}
