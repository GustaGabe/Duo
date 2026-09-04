import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export type CardTone = 'plain' | 'accent' | 'invert' | 'muted';

const TONES: Record<CardTone, string> = {
  plain: 'border-[1.5px] border-line bg-surface text-ink',
  accent: 'bg-accent text-on-accent',
  invert: 'bg-invert text-on-invert',
  muted: 'bg-surface-2 text-ink',
};

export interface CardProps extends ComponentProps<'div'> {
  tone?: CardTone;
}

export function Card({ tone = 'plain', className, ...props }: CardProps) {
  return <div className={cn('rounded-card p-5', TONES[tone], className)} {...props} />;
}
