import { cn } from '@/lib/cn';
import { percentWidth } from '@/lib/format';

export interface ProgressProps {
  value: number;
  label: string;
  barClassName?: string;
  className?: string;
}

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
  sharePercent: number;
  label: string;
  className?: string;
}

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
