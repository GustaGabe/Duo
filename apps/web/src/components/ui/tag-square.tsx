import type { CategoryColor } from '@duo/shared';

import { cn } from '@/lib/cn';

export type TagSize = 'sm' | 'md' | 'lg';

const SIZES: Record<TagSize, string> = {
  sm: 'size-9 rounded-control text-micro',
  md: 'size-11 rounded-field text-caption',
  lg: 'size-15 rounded-panel text-base',
};

/** Category colours. Keys come from the domain; values are theme tokens. */
const COLORS: Record<CategoryColor, string> = {
  accent: 'bg-accent text-on-accent',
  ink: 'bg-ink text-surface',
  mist: 'bg-surface-2 text-ink-soft',
  violet: 'bg-accent/70 text-on-accent',
  silver: 'bg-surface-3 text-ink-soft',
};

export interface TagSquareProps {
  /** Two-letter badge, e.g. `MC`. */
  tag: string;
  color?: CategoryColor;
  size?: TagSize;
  className?: string;
}

/** Square tile carrying the category badge — present in every entry list. */
export function TagSquare({ tag, color = 'mist', size = 'md', className }: TagSquareProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center font-mono font-medium',
        SIZES[size],
        COLORS[color],
        className,
      )}
    >
      {tag}
    </span>
  );
}

/** Circular swatch in the category colour picker. */
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
      className={cn(
        'size-11 cursor-pointer rounded-pill border-[3px] transition-colors',
        COLORS[color],
        selected ? 'border-ink' : 'border-surface',
      )}
    />
  );
}
