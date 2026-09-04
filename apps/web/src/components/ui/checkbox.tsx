import { cn } from '@/lib/cn';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
  className?: string;
}

/** 22×22 box, radius 7 — the terms and "keep me signed in" checkbox. */
export function Checkbox({ checked, onChange, label, hideLabel = false, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onChange(!checked)}
      className={cn(
        'grid size-5.5 shrink-0 cursor-pointer place-items-center rounded-[7px] border-[1.5px] transition-colors',
        checked ? 'border-accent bg-accent text-on-accent' : 'border-line-dashed bg-surface',
        className,
      )}
    >
      {checked ? (
        <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden="true">
          <path
            d="M2.5 7.2 5.6 10.3 11.5 4.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}
