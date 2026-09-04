import { create } from 'zustand';

import type { ModalKey, ModalPropsOf } from './modal-registry';

/**
 * Which modal is open. One at a time — the whole app shares this single instance.
 *
 * `props` is stored untyped because the key is what determines its shape; the public API
 * (`useModal`) ties the two back together. Nothing outside `components/modal/` touches this.
 */
interface OpenModal {
  key: ModalKey;
  props: Record<string, unknown>;
}

interface ModalState {
  active: OpenModal | null;

  open: (key: ModalKey, props: Record<string, unknown>) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  active: null,
  open: (key, props) => set({ active: { key, props } }),
  close: () => set({ active: null }),
}));

/** Typed re-export for `use-modal`. */
export type { ModalKey, ModalPropsOf };
