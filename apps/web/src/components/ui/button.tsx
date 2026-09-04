import type { ComponentProps } from 'react';

import { tv, type VariantProps } from '@/lib/tv';

export const button = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center gap-2 font-sans transition-colors',
    'disabled:pointer-events-none disabled:bg-disabled disabled:text-on-disabled',
  ],
  variants: {
    variant: {
      primary: 'bg-primary text-on-primary hover:bg-primary-hover',
      action: 'bg-accent text-on-accent hover:bg-accent-strong',
      secondary: 'border-[1.5px] border-line bg-surface text-ink hover:bg-surface-2',
      ghost: 'text-ink hover:bg-surface-2',
      subtle: 'bg-surface-2 text-ink-soft hover:bg-surface-3',
      invert: 'bg-on-invert/10 text-on-invert hover:bg-on-invert/20',
      contrast: 'bg-surface text-ink hover:bg-surface-3',
    },
    size: {
      lg: 'h-15 rounded-panel px-6 text-base font-semibold',
      md: 'h-13 rounded-field px-5 text-body font-semibold',
      sm: 'h-11 rounded-control px-4 text-label font-medium',
      icon: 'size-10 rounded-control text-base',
    },
    block: { true: 'w-full' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'color'>, ButtonVariants {}

export function Button({ variant, size, block, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={button({ variant, size, block, className })} {...props} />;
}
