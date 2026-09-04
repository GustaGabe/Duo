import { cn } from '@/lib/cn';

export function Logo({ withName = false, className }: { withName?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid size-11 place-items-center rounded-field bg-accent text-lg font-bold text-on-accent">
        D
      </span>
      {withName ? <span className="text-base font-semibold">Duo</span> : null}
    </div>
  );
}
