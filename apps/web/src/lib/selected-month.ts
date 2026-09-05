import type { IsoMonth } from '@duo/shared';
import { create } from 'zustand';

import { currentMonth } from './clock';

interface SelectedMonthState {
  month: IsoMonth;
  setMonth: (month: IsoMonth) => void;
  reset: () => void;
}

export const useSelectedMonthStore = create<SelectedMonthState>((set) => ({
  month: currentMonth(),
  setMonth: (month) => set({ month }),
  reset: () => set({ month: currentMonth() }),
}));
