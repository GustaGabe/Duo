import type { ComponentProps } from 'react';

import { tv, type VariantProps } from '@/lib/tv';

export const card = tv({
  base: 'rounded-card p-5',
  variants: {
    tone: {
      plain: 'border-[1.5px] border-line bg-surface text-ink',
      accent: 'bg-accent text-on-accent',
      invert: 'bg-invert text-on-invert',
      muted: 'bg-surface-2 text-ink',
    },
  },
  defaultVariants: { tone: 'plain' },
});

export type CardVariants = VariantProps<typeof card>;

export interface CardProps extends ComponentProps<'div'>, CardVariants {}

export function Card({ tone, className, ...props }: CardProps) {
  return <div className={card({ tone, className })} {...props} />;
}
