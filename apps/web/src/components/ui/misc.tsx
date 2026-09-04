import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Loading block shaped like the content that will replace it. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-panel bg-surface-2', className)} {...props} />;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 py-12 text-center', className)}>
      <p className="text-section text-ink">{title}</p>
      {description ? <p className="max-w-xs text-body text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

export interface StepperProps {
  /** Current step, 1-based. */
  current: number;
  total: number;
  className?: string;
}

/** Sign-up progress track ("passo 1 de 2"). */
export function Stepper({ current, total, className }: StepperProps) {
  return (
    <div
      role="progressbar"
      aria-label={`Passo ${current} de ${total}`}
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      className={cn('flex gap-1.5', className)}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn('h-1 flex-1 rounded-pill', index < current ? 'bg-accent' : 'bg-line')}
        />
      ))}
    </div>
  );
}

/** Uppercase mono label that opens sections and table columns. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('eyebrow', className)} {...props} />;
}
