import type { IsoMonth } from '@duo/shared';
import { useQuery } from '@tanstack/react-query';

import { getMonthSummary } from '@/api/summary';
import { currentMonth } from '@/lib/clock';

import { queryKeys } from './queries';

export function useMonthSummary(spaceId: string | undefined, month: IsoMonth = currentMonth()) {
  return useQuery({
    queryKey: queryKeys.summary(spaceId ?? '', month),
    queryFn: () => getMonthSummary(spaceId!, month),
    enabled: Boolean(spaceId),
  });
}
