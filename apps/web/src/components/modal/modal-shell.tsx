import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * ===========================================================================
 *  The app's ONLY overlay + modal panel.
 * ===========================================================================
 *
 * Nothing else may render a `<dialog>`, a `createPortal` or a `fixed inset-0` overlay — ESLint
 * blocks it. If a new case doesn't fit, the answer is a new variant here, never a second shell.
 * See CLAUDE.md, Rule 1.
 *
 * It adapts along two axes:
 *
 *   shape   sheet pinned to the bottom on mobile  ->  centred dialog from `md` up
 *   size    sm | md | lg | full
 *
 * That is how "Nova despesa" can be a full-height sheet on a phone and a 720px dialog on desktop
 * while being the same component and the same content.
 *
 * Built on the native `<dialog>`: focus trap, Esc, top layer and inert background come for free,
 * with no library at all.
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

const SIZES: Record<ModalSize, string> = {
  sm: 'md:max-w-[420px]',
  md: 'md:max-w-[560px]',
  lg: 'md:max-w-[720px]',
  full: 'md:max-w-[960px]',
};

export interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  size?: ModalSize;
  children: ReactNode;
  /** Desktop side column — becomes a block at the end of the content on mobile. */
  aside?: ReactNode;
  /** Action bar pinned to the footer. */
  footer?: ReactNode;
  /** Hides the header when the content draws its own top. */
  bare?: boolean;
}

export function ModalShell({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  aside,
  footer,
  bare = false,
}: ModalShellProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Keep the `<dialog>` in sync with React state.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Esc and the browser back button fire `close` on the element itself.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Lock background scrolling while the modal is open.
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
      // Backdrop click closes: the target is the dialog itself, never the inner panel.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        'w-full max-w-none bg-transparent p-0 text-ink outline-none backdrop:bg-invert/55 backdrop:backdrop-blur-[2px]',
        // Mobile: pinned to the bottom, full width.
        'mt-auto mb-0 ml-0 max-h-[92dvh]',
        // Desktop: centred.
        'md:m-auto md:max-h-[88dvh]',
        SIZES[size],
      )}
    >
      <div
        className={cn(
          'flex max-h-[92dvh] flex-col overflow-hidden bg-surface shadow-float',
          'rounded-t-sheet md:max-h-[88dvh] md:rounded-modal',
        )}
      >
        {bare ? null : (
          <header className="flex items-start gap-4 px-6 pt-6 pb-4 md:px-8 md:pt-8">
            {/* Sheet grabber — hidden on desktop, where there is no drag gesture. */}
            <span className="absolute inset-x-0 top-2.5 mx-auto h-1 w-11 rounded-pill bg-line md:hidden" />
            <div className="min-w-0 flex-1">
              <h2 className="text-heading">{title}</h2>
              {description ? <p className="mt-1 text-body text-muted">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="grid size-8.5 shrink-0 cursor-pointer place-items-center rounded-control bg-surface-2 text-muted transition-colors hover:bg-surface-3 hover:text-ink"
            >
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

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6 md:px-8 md:pb-8',
            bare && 'pt-6 md:pt-8',
            // With a side column desktop goes two-up; mobile stays stacked.
            aside && 'md:flex-row md:gap-7',
          )}
        >
          <div className="min-w-0 flex-1">{children}</div>
          {aside ? <div className="shrink-0 md:w-65">{aside}</div> : null}
        </div>

        {footer ? (
          <footer className="border-t border-line bg-surface px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
