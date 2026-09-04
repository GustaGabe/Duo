import { useEffect, useRef, type ReactNode } from 'react';

import { tv, type VariantProps } from '@/lib/tv';

export const modal = tv({
  slots: {
    dialog: [
      'w-full max-w-none bg-transparent p-0 text-ink outline-none backdrop:bg-invert/55',
      'mt-auto mb-0 ml-0 max-h-[92dvh]',
      'md:m-auto md:max-h-[88dvh]',
    ],
    panel:
      'flex max-h-[92dvh] flex-col overflow-hidden rounded-t-sheet bg-surface shadow-float md:max-h-[88dvh] md:rounded-modal',
    header: 'relative flex items-start gap-4 px-6 pt-6 pb-4 md:px-8 md:pt-8',
    grabber: 'absolute inset-x-0 top-2.5 mx-auto h-1 w-11 rounded-pill bg-line md:hidden',
    close:
      'grid size-8.5 shrink-0 cursor-pointer place-items-center rounded-control bg-surface-2 text-muted transition-colors hover:bg-surface-3 hover:text-ink',
    body: 'min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-8 md:pb-8',
    footer:
      'border-t border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8',
  },
  variants: {
    size: {
      sm: { dialog: 'md:max-w-[420px]' },
      md: { dialog: 'md:max-w-[560px]' },
      lg: { dialog: 'md:max-w-[720px]' },
      full: { dialog: 'md:max-w-[960px]' },
    },
    hideHeader: {
      true: { body: 'pt-6 md:pt-8' },
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ModalProps extends VariantProps<typeof modal> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size,
  hideHeader,
  footer,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const styles = modal({ size, hideHeader });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={typeof title === 'string' ? title : undefined}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={styles.dialog()}
    >
      <div className={styles.panel()}>
        {hideHeader ? null : (
          <header className={styles.header()}>
            <span className={styles.grabber()} />
            <div className="min-w-0 flex-1">
              {title ? <h2 className="text-heading">{title}</h2> : null}
              {description ? <p className="mt-1 text-body text-muted">{description}</p> : null}
            </div>
            <button type="button" onClick={onClose} aria-label="Fechar" className={styles.close()}>
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>
        )}

        <div className={styles.body()}>{children}</div>

        {footer ? <footer className={styles.footer()}>{footer}</footer> : null}
      </div>
    </dialog>
  );
}
