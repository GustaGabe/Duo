import type { IsoMonth } from '@duo/shared';
import { useQuery } from '@tanstack/react-query';

import { getMonthSummary } from '@/api/summary';
import { CURRENT_MONTH } from '@/api/mock-db';

import { queryKeys } from './queries';

export function useMonthSummary(month: IsoMonth = CURRENT_MONTH) {
  return useQuery({
    queryKey: queryKeys.summary(month),
    queryFn: () => getMonthSummary(month),
  });
}
