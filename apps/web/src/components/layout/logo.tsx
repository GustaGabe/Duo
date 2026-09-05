import { cn } from '@/lib/cn';

export function DuoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="currentColor">
      <path fillRule="evenodd" d="M31 12 L24 12 A20 20 0 0 0 24 52 L31 52 Z M24 19 A13 13 0 0 0 24 45 Z" />
      <path fillRule="evenodd" d="M33 12 L40 12 A20 20 0 0 1 40 52 L33 52 Z M40 19 A13 13 0 0 1 40 45 Z" />
    </svg>
  );
}

export function Logo({ withName = false, className }: { withName?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid size-11 shrink-0 place-items-center rounded-field bg-accent text-on-accent">
        <DuoMark className="size-7" />
      </span>
      {withName ? <span className="text-base font-semibold">Duo</span> : null}
    </div>
  );
}
