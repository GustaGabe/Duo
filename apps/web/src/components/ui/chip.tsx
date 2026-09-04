import type { ComponentProps } from 'react';

import { tv, type VariantProps } from '@/lib/tv';

export const chip = tv({
  base: 'cursor-pointer rounded-pill border-[1.5px] px-4 py-2 text-label font-medium whitespace-nowrap transition-colors',
  variants: {
    tone: {
      ink: '',
      accent: '',
      'owner-a': '',
      'owner-b': '',
    },
    selected: {
      true: '',
      false: 'border-line bg-surface text-ink-soft hover:bg-surface-2',
    },
  },
  compoundVariants: [
    { tone: 'ink', selected: true, class: 'border-ink bg-ink text-surface' },
    { tone: 'accent', selected: true, class: 'border-accent bg-accent text-on-accent' },
    { tone: 'owner-a', selected: true, class: 'border-owner-a bg-owner-a text-on-owner-a' },
    { tone: 'owner-b', selected: true, class: 'border-owner-b bg-owner-b text-on-owner-b' },
  ],
  defaultVariants: { tone: 'ink', selected: false },
});

export type ChipVariants = VariantProps<typeof chip>;

export interface ChipProps
  extends Omit<ComponentProps<'button'>, 'aria-pressed'>,
    Omit<ChipVariants, 'selected'> {
  selected?: boolean;
}

export function Chip({ selected = false, tone, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={chip({ tone, selected, className })}
      {...props}
    />
  );
}
