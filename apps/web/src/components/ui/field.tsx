import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

import { cn } from '@/lib/cn';
import { tv } from '@/lib/tv';

export const control = tv({
  base: [
    'h-14 w-full rounded-field border-[1.5px] border-line bg-surface px-4 text-body text-ink lg:h-13',
    'outline-none transition-[box-shadow,border-color] placeholder:text-subtle',
    'focus:border-accent focus:shadow-[var(--shadow-focus)]',
  ],
});

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
  return <input className={control({ class: className })} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={control({ class: cn('cursor-pointer', className) })} {...props} />;
}

export function FieldBox({ className, ...props }: ComponentProps<'div'>) {
  return <div className={control({ class: cn('flex items-center gap-3', className) })} {...props} />;
}
