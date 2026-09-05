import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveSpaceState {
  spaceId: string | null;
  setSpaceId: (spaceId: string) => void;
}

export const useActiveSpaceStore = create<ActiveSpaceState>()(
  persist(
    (set) => ({
      spaceId: null,
      setSpaceId: (spaceId) => set({ spaceId }),
    }),
    { name: 'duo-active-space' },
  ),
);
