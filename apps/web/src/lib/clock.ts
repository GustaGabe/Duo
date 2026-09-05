import type { IsoDate, IsoMonth } from '@duo/shared';

export function today(): IsoDate {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth(): IsoMonth {
  return new Date().toISOString().slice(0, 7);
}
