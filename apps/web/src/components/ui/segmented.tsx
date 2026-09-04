import { cn } from '@/lib/cn';
import { tv, type VariantProps } from '@/lib/tv';

export const segment = tv({
  base: 'cursor-pointer border-[1.5px] text-label font-medium transition-colors',
  variants: {
    shape: {
      pill: 'rounded-pill px-4 py-2.5',
      block: 'h-11.5 flex-1 rounded-control',
    },
    selected: {
      true: 'border-ink bg-ink text-surface',
      false: 'border-line bg-surface text-ink-soft hover:bg-surface-2',
    },
  },
  defaultVariants: { shape: 'pill', selected: false },
});

export type SegmentVariants = VariantProps<typeof segment>;

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  shape?: SegmentVariants['shape'];
  className?: string;
  'aria-label'?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  shape,
  className,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={segment({ shape, selected: option.value === value })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
