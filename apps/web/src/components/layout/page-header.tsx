import type { ReactNode } from 'react';

import { AvatarStack } from '@/components/ui/avatar';
import { useActiveSpace } from '@/hooks/use-spaces';
import { useTheme } from '@/lib/theme-context';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="min-w-0">
        <h1 className="text-heading">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-label text-muted">{subtitle}</p> : null}
      </div>
      <div className="flex-1" />
      {actions}
    </div>
  );
}

export function MobileTopBar({ onMenu }: { onMenu: () => void }) {
  const { space } = useActiveSpace();

  return (
    <div className="flex items-center justify-between lg:hidden">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Abrir menu"
        className="flex cursor-pointer flex-col gap-1.5 py-2 pr-2"
      >
        <span className="h-[2.5px] w-5.5 rounded-pill bg-ink" />
        <span className="h-[2.5px] w-3.5 rounded-pill bg-ink" />
      </button>
      {space ? <AvatarStack people={space.members} size="lg" /> : null}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Usar tema claro' : 'Usar tema escuro'}
      className="grid size-11 cursor-pointer place-items-center rounded-field border-[1.5px] border-line bg-surface text-ink transition-colors hover:bg-surface-2"
    >
      <svg viewBox="0 0 20 20" className="size-4.5" aria-hidden="true">
        {dark ? (
          <path
            d="M16 11.4A6.6 6.6 0 0 1 8.6 4a6.6 6.6 0 1 0 7.4 7.4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4" />
          </g>
        )}
      </svg>
    </button>
  );
}
