import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@/lib/cn';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('block text-caption font-medium text-ink-soft', className)} {...props} />;
}

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: (id: string) => ReactNode;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      {children(id)}
      {error ? (
        <p className="text-caption text-accent">{error}</p>
      ) : hint ? (
        <p className="text-caption text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-14 w-full rounded-field border-[1.5px] border-line bg-surface px-4 text-body text-ink',
        'placeholder:text-subtle outline-none transition-[box-shadow,border-color]',
        'focus:border-accent focus:shadow-[var(--shadow-focus)]',
        'lg:h-13',
        className,
      )}
      {...props}
    />
  );
}

export function FieldBox({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-14 w-full items-center gap-3 rounded-field border-[1.5px] border-line bg-surface px-4 text-body text-ink lg:h-13',
        className,
      )}
      {...props}
    />
  );
}
