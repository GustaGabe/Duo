import { tv, type VariantProps } from '@/lib/tv';

export const checkbox = tv({
  base: 'grid size-5.5 shrink-0 cursor-pointer place-items-center rounded-[7px] border-[1.5px] transition-colors',
  variants: {
    checked: {
      true: 'border-accent bg-accent text-on-accent',
      false: 'border-line-dashed bg-surface',
    },
  },
  defaultVariants: { checked: false },
});

export interface CheckboxProps extends VariantProps<typeof checkbox> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, label, hideLabel = false, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onChange(!checked)}
      className={checkbox({ checked, className })}
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
