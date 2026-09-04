import { Button } from '@/components/ui/button';

export interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

/**
 * Content only — no overlay, no close button, no dialog element. ModalShell supplies all of it.
 * This is what every modal in this app looks like.
 */
export function ConfirmModal({
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  close,
}: ConfirmModalProps & { close: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body text-ink-soft">{message}</p>
      <div className="flex gap-3">
        <Button variant="secondary" block onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          block
          onClick={() => {
            onConfirm();
            close();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
