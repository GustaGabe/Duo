import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  shape?: 'pill' | 'block';
  className?: string;
  'aria-label'?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  shape = 'pill',
  className,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex gap-2', className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer border-[1.5px] text-label font-medium transition-colors',
              shape === 'pill'
                ? 'rounded-pill px-4 py-2.5'
                : 'h-11.5 flex-1 rounded-control',
              selected
                ? 'border-ink bg-ink text-surface'
                : 'border-line bg-surface text-ink-soft hover:bg-surface-2',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
