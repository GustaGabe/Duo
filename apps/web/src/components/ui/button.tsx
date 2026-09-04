import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

/**
 * Design-system button. The variants come straight from the "08 · system design" artboard:
 * primary (black, hover blue), action (blue), secondary (outline) and disabled.
 */
export type ButtonVariant = 'primary' | 'action' | 'secondary' | 'ghost' | 'subtle' | 'invert';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'icon';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  action: 'bg-accent text-on-accent hover:bg-accent-strong',
  secondary: 'border-[1.5px] border-line bg-surface text-ink hover:bg-surface-2',
  ghost: 'text-ink hover:bg-surface-2',
  subtle: 'bg-surface-2 text-ink-soft hover:bg-surface-3',
  invert: 'bg-on-invert/10 text-on-invert hover:bg-on-invert/20',
};

const SIZES: Record<ButtonSize, string> = {
  lg: 'h-15 rounded-panel px-6 text-base font-semibold',
  md: 'h-13 rounded-field px-5 text-body font-semibold',
  sm: 'h-11 rounded-control px-4 text-label font-medium',
  icon: 'size-10 rounded-control text-base',
};

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fills the available width — the CTA on mobile screens. */
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 font-sans transition-colors',
        'disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
