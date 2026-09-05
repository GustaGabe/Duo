import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { TransactionForm } from '@/components/finance/transaction-form';
import { SpaceForm } from '@/components/spaces/space-form';
import { SpaceSwitcher } from '@/components/spaces/space-switcher';
import { BottomNav } from '@/components/layout/bottom-nav';
import { MobileTopBar } from '@/components/layout/page-header';
import { SIDEBAR_ITEMS } from '@/components/layout/nav';
import { navRow } from '@/components/layout/nav-link';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useCategories } from '@/hooks/use-categories';
import { useActiveSpace, useCurrentUser } from '@/hooks/use-spaces';
import { TODAY } from '@/lib/clock';

export const Route = createFileRoute('/_app')({ component: AppLayout });

type Sheet = 'entry' | 'switch' | 'new-space' | 'menu' | null;

const TITLES: Record<Exclude<Sheet, null>, string> = {
  entry: 'Novo lançamento',
  switch: 'Trocar de espaço',
  'new-space': 'Novo espaço',
  menu: 'Navegação',
};

function AppLayout() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const navigate = useNavigate();
  const { space, spaces, tones, setSpaceId } = useActiveSpace();
  const { data: me } = useCurrentUser();
  const { data: categories } = useCategories(space?.id);

  const close = () => setSheet(null);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar onSwitchSpace={() => setSheet('switch')} />

      <main className="pb-nav flex min-w-0 flex-1 flex-col gap-6 px-6 pt-12 lg:px-8 lg:py-7 lg:pb-8">
        <MobileTopBar onMenu={() => setSheet('menu')} />
        <Outlet />
      </main>

      <BottomNav onNewEntry={() => setSheet('entry')} />

      <Modal
        open={sheet !== null}
        onClose={close}
        size={sheet === 'entry' ? 'lg' : 'sm'}
        title={sheet ? TITLES[sheet] : ''}
        description={sheet === 'switch' ? 'Cada espaço tem contas e pessoas próprias.' : undefined}
      >
        {sheet === 'entry' && space && categories && me ? (
          <TransactionForm
            spaceId={space.id}
            members={space.members}
            categories={categories}
            viewerId={me.id}
            today={TODAY}
            onDone={close}
          />
        ) : null}

        {sheet === 'switch' && spaces ? (
          <div className="flex flex-col gap-4">
            <SpaceSwitcher
              spaces={spaces}
              activeId={space?.id}
              tones={tones}
              onPick={(id) => {
                setSpaceId(id);
                close();
              }}
            />
            <div className="flex gap-2.5">
              <Button variant="secondary" block onClick={() => setSheet('new-space')}>
                Criar espaço
              </Button>
              <Button
                block
                onClick={() => {
                  close();
                  void navigate({ to: '/spaces' });
                }}
              >
                Gerenciar
              </Button>
            </div>
          </div>
        ) : null}

        {sheet === 'new-space' ? <SpaceForm onDone={close} /> : null}

        {sheet === 'menu' ? (
          <nav className="flex flex-col divide-y divide-line-soft">
            {SIDEBAR_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} onClick={close} className={navRow()}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Modal>
    </div>
  );
}
