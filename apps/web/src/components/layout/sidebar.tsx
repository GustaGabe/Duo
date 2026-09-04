import { Link } from '@tanstack/react-router';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCouple } from '@/hooks/use-couple';

import { Logo } from './logo';
import { SIDEBAR_ITEMS } from './nav';

export function Sidebar({ onInvite }: { onInvite: () => void }) {
  const { data: couple } = useCouple();

  return (
    <aside className="hidden w-62 shrink-0 flex-col gap-7 bg-invert p-5 pt-7 text-on-invert lg:flex">
      <Logo withName className="px-1" />

      <nav className="flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex h-11 items-center rounded-control px-3.5 text-sm text-on-invert-muted transition-colors hover:bg-on-invert/10 hover:text-on-invert"
            activeProps={{ className: 'bg-accent font-medium text-on-accent hover:bg-accent' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="rounded-panel border border-on-invert/15 p-4">
        <p className="eyebrow mb-3 text-on-invert-muted">Casal</p>
        <ul className="flex flex-col gap-2.5">
          {couple?.members.map((member) => (
            <li key={member.id} className="flex items-center gap-2.5">
              <Avatar name={member.name} slot={member.slot} size="sm" />
              <span className="text-label">{member.name.split(' ')[0]}</span>
            </li>
          ))}
        </ul>
        <Button variant="invert" size="sm" block className="mt-3.5" onClick={onInvite}>
          Convidar
        </Button>
      </div>
    </aside>
  );
}
