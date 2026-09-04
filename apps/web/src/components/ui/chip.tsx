import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

export type ChipTone = 'ink' | 'accent' | 'owner-a' | 'owner-b';

/** Chip colours when selected. Unselected chips all share the neutral outline. */
const SELECTED: Record<ChipTone, string> = {
  ink: 'border-ink bg-ink text-surface',
  accent: 'border-accent bg-accent text-on-accent',
  'owner-a': 'border-owner-a bg-owner-a text-on-owner-a',
  'owner-b': 'border-owner-b bg-owner-b text-on-owner-b',
};

export interface ChipProps extends Omit<ComponentProps<'button'>, 'aria-pressed'> {
  selected?: boolean;
  tone?: ChipTone;
}

/**
 * Filter pill (Todas / Saídas / Entradas, Ambos / Ana / Léo).
 * Selection is announced through `aria-pressed`, not colour alone.
 */
export function Chip({ selected = false, tone = 'ink', className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'cursor-pointer rounded-pill border-[1.5px] px-4 py-2 text-label font-medium whitespace-nowrap transition-colors',
        selected ? SELECTED[tone] : 'border-line bg-surface text-ink-soft hover:bg-surface-2',
        className,
      )}
      {...props}
    />
  );
}
