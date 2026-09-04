import { tv, type VariantProps } from '@/lib/tv';

export const switchTrack = tv({
  base: 'flex h-7 w-11.5 shrink-0 cursor-pointer items-center rounded-pill p-[3px] transition-colors',
  variants: {
    checked: { true: 'justify-end bg-accent', false: 'justify-start bg-line' },
  },
  defaultVariants: { checked: false },
});

export interface SwitchProps extends VariantProps<typeof switchTrack> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hideLabel?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, label, hideLabel = false, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onChange(!checked)}
      className={switchTrack({ checked, className })}
    >
      <span className="size-5.5 rounded-pill bg-surface shadow-card" />
    </button>
  );
}
