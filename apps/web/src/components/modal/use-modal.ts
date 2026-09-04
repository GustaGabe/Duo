import { useCallback, useMemo } from 'react';

import type { ModalKey, ModalPropsOf } from './modal-registry';
import { useModalStore } from './modal-store';

/**
 * How every modal in the app gets opened:
 *
 *     const { open } = useModal();
 *     open('transaction-form', { kind: 'expense' });
 *
 * The key determines the prop types — a wrong name or a missing prop is a compile error.
 * Never drive a modal with `useState`. See CLAUDE.md, Rule 1.
 */
export function useModal() {
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);

  const open = useCallback(
    <K extends ModalKey>(key: K, ...args: EmptyProps<K> extends true ? [] : [ModalPropsOf<K>]) => {
      openModal(key, (args[0] ?? {}) as Record<string, unknown>);
    },
    [openModal],
  );

  return useMemo(() => ({ open, close: closeModal }), [open, closeModal]);
}

/** `true` when the modal needs no props, which makes the second argument optional. */
type EmptyProps<K extends ModalKey> = Record<string, never> extends ModalPropsOf<K> ? true : false;
