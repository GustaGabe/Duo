import { cn } from '@/lib/cn';
import { percentWidth } from '@/lib/format';

export interface ProgressProps {
  /** 0 to 100. */
  value: number;
  label: string;
  /** Colour class for the filled bar — use a token (`bg-accent`, `bg-owner-b`…). */
  barClassName?: string;
  className?: string;
}

/** Usage bar: track on the soft surface, fill from a token. */
export function Progress({ value, label, barClassName = 'bg-accent', className }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 overflow-hidden rounded-pill bg-surface-2', className)}
    >
      <div className={cn('h-full rounded-pill', barClassName)} style={{ width: percentWidth(value) }} />
    </div>
  );
}

export interface SplitBarProps {
  /** Slot A's share, 0 to 100. The remainder goes to slot B. */
  sharePercent: number;
  label: string;
  className?: string;
}

/** The "quem gastou" bar: two slices with a 3px gap between them, as in the design. */
export function SplitBar({ sharePercent, label, className }: SplitBarProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn('flex h-2.5 gap-[3px] overflow-hidden rounded-pill', className)}
    >
      <div className="bg-owner-a" style={{ width: percentWidth(sharePercent) }} />
      <div className="bg-owner-b" style={{ width: percentWidth(100 - sharePercent) }} />
    </div>
  );
}
