import type { IsoMonth, MonthSummary } from '@duo/shared';

import { request } from './http';

export function getMonthSummary(spaceId: string, month: IsoMonth): Promise<MonthSummary> {
  const params = new URLSearchParams({ spaceId, month });

  return request<MonthSummary>(`/summary?${params.toString()}`);
}
