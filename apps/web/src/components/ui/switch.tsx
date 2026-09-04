import { cn } from '@/lib/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Hides the visible text when the label already sits next to it. */
  hideLabel?: boolean;
  className?: string;
}

/** The design system's 46×28 switch. */
export function Switch({ checked, onChange, label, hideLabel = false, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-7 w-11.5 shrink-0 cursor-pointer items-center rounded-pill p-[3px] transition-colors',
        checked ? 'justify-end bg-accent' : 'justify-start bg-line',
        className,
      )}
    >
      <span className="size-5.5 rounded-pill bg-surface shadow-card" />
    </button>
  );
}
