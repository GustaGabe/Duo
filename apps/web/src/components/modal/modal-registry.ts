import type { ComponentType } from 'react';

import { ConfirmModal, type ConfirmModalProps } from '@/modals/confirm-modal';

import type { ModalSize } from './modal-shell';

/**
 * Every modal in the app, keyed by name.
 *
 * To add one: write the *content* in `src/modals/`, then add a line here. You never write
 * overlay, close button, focus trap or responsive behaviour — `ModalShell` already has them.
 */
export interface ModalPropsMap {
  confirm: ConfirmModalProps;
}

export type ModalKey = keyof ModalPropsMap;
export type ModalPropsOf<K extends ModalKey> = ModalPropsMap[K];

export interface ModalDefinition<K extends ModalKey> {
  component: ComponentType<ModalPropsMap[K] & { close: () => void }>;
  size: ModalSize;
  title: string | ((props: ModalPropsMap[K]) => string);
  description?: string | ((props: ModalPropsMap[K]) => string);
  /** Content draws its own header. */
  bare?: boolean;
}

export const modalRegistry: { [K in ModalKey]: ModalDefinition<K> } = {
  confirm: {
    component: ConfirmModal,
    size: 'sm',
    title: 'Tem certeza?',
  },
};
