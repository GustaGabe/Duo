import type { ComponentType } from 'react';

import { modalRegistry, type ModalKey } from './modal-registry';
import { ModalShell } from './modal-shell';
import { useModalStore } from './modal-store';

type AnyModalProps = Record<string, unknown> & { close: () => void };

function resolve<T>(value: T | ((props: never) => T), props: Record<string, unknown>): T {
  return typeof value === 'function'
    ? (value as (props: Record<string, unknown>) => T)(props)
    : value;
}

/**
 * Mounted exactly once, in `__root.tsx`. Reads which modal is open and renders its content
 * inside the app's only `ModalShell`.
 */
export function ModalRoot() {
  const active = useModalStore((state) => state.active);
  const close = useModalStore((state) => state.close);

  if (!active) return null;

  const definition = modalRegistry[active.key as ModalKey];
  // The registry keeps key and props in sync; this is the one place the pair goes dynamic.
  const Content = definition.component as unknown as ComponentType<AnyModalProps>;

  return (
    <ModalShell
      open
      onClose={close}
      size={definition.size}
      bare={definition.bare}
      title={resolve(definition.title, active.props)}
      description={definition.description ? resolve(definition.description, active.props) : undefined}
    >
      <Content {...active.props} close={close} />
    </ModalShell>
  );
}
