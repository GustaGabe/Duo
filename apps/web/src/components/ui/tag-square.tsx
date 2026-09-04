import type { CategoryColor } from '@duo/shared';

import { tv, type VariantProps } from '@/lib/tv';

export const tagSquare = tv({
  base: 'grid shrink-0 place-items-center font-mono font-medium',
  variants: {
    color: {
      accent: 'bg-accent text-on-accent',
      ink: 'bg-ink text-surface',
      mist: 'bg-surface-2 text-ink-soft',
      violet: 'bg-accent/70 text-on-accent',
      silver: 'bg-surface-3 text-ink-soft',
    },
    size: {
      sm: 'size-9 rounded-control text-micro',
      md: 'size-11 rounded-field text-caption',
      lg: 'size-15 rounded-panel text-base',
    },
  },
  defaultVariants: { color: 'mist', size: 'md' },
});

export type TagSquareVariants = VariantProps<typeof tagSquare>;

export interface TagSquareProps extends TagSquareVariants {
  tag: string;
  className?: string;
}

export function TagSquare({ tag, color, size, className }: TagSquareProps) {
  return (
    <span aria-hidden="true" className={tagSquare({ color, size, className })}>
      {tag}
    </span>
  );
}

export const colorSwatch = tv({
  base: 'size-11 cursor-pointer rounded-pill border-[3px] transition-colors',
  variants: {
    selected: { true: 'border-ink', false: 'border-surface' },
  },
  defaultVariants: { selected: false },
});

export function ColorSwatch({
  color,
  selected,
  onSelect,
}: {
  color: CategoryColor;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Cor ${color}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={colorSwatch({ selected, class: tagSquare({ color, class: 'size-11 rounded-pill' }) })}
    />
  );
}
