import { Link } from '@tanstack/react-router';

import { SpaceMark } from '@/components/spaces/space-mark';
import { AvatarStack } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useActiveSpace } from '@/hooks/use-spaces';

import { Logo } from './logo';
import { SIDEBAR_ITEMS } from './nav';
import { navLink, wipBadge } from './nav-link';

export function Sidebar({ onSwitchSpace }: { onSwitchSpace: () => void }) {
  const { space, spaces, tones } = useActiveSpace();

  return (
    <aside className="hidden w-62 shrink-0 flex-col gap-7 bg-invert p-5 pt-7 text-on-invert lg:flex">
      <Logo withName className="px-1" />

      <nav className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className={navLink()}>
            {item.label}
            {item.wip ? <span className={wipBadge({ on: 'invert' })}>WIP</span> : null}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      {space ? (
        <div className="rounded-panel border border-on-invert/15 p-4">
          <p className="eyebrow mb-3 text-on-invert-muted">Espaço ativo</p>
          <div className="flex items-center gap-2.5">
            <SpaceMark space={space} tone={tones[space.id]} size="sm" />
            <p className="min-w-0 flex-1 truncate text-label font-medium">{space.name}</p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <AvatarStack people={space.members} size="sm" />
            <span className="text-micro text-on-invert-muted">
              {space.members.length} {space.members.length === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
          <Button variant="invert" size="sm" block className="mt-3.5" onClick={onSwitchSpace}>
            {spaces && spaces.length > 1 ? 'Trocar espaço' : 'Gerenciar'}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
