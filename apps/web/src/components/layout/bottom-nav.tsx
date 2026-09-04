import { Link } from '@tanstack/react-router';

import { navTab } from './nav-link';
import { BOTTOM_NAV_ITEMS } from './nav';

export function BottomNav({ onNewEntry }: { onNewEntry: () => void }) {
  const [start, end] = [BOTTOM_NAV_ITEMS.slice(0, 2), BOTTOM_NAV_ITEMS.slice(2)];

  return (
    <nav className="fixed inset-x-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex h-16 items-center justify-around rounded-card border border-invert-2 bg-invert px-2 lg:hidden">
      {start.map((item) => (
        <NavLabel key={item.to} to={item.to} label={item.label} />
      ))}

      <button
        type="button"
        onClick={onNewEntry}
        aria-label="Novo lançamento"
        className="grid size-11.5 cursor-pointer place-items-center rounded-field bg-accent text-2xl font-medium text-on-accent transition-colors hover:bg-accent-strong"
      >
        +
      </button>

      {end.map((item) => (
        <NavLabel key={item.to} to={item.to} label={item.label} />
      ))}
    </nav>
  );
}

function NavLabel({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className={navTab()}>
      {label}
    </Link>
  );
}
