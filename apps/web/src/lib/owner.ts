import type { OwnerSlot } from '@duo/shared';

/**
 * Owner colours. Ana is slot A (blue), Léo is slot B (black in light, white in dark).
 * Always go through here instead of picking the colour by hand — this is what keeps the
 * couple legible in both themes.
 */
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
