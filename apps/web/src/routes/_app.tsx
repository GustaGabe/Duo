import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { TransactionForm } from '@/components/finance/transaction-form';
import { InvitePanel } from '@/components/finance/invite-panel';
import { BottomNav } from '@/components/layout/bottom-nav';
import { MobileTopBar } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { SIDEBAR_ITEMS } from '@/components/layout/nav';
import { Modal } from '@/components/ui/modal';
import { TODAY } from '@/lib/clock';
import { useCategories } from '@/hooks/use-categories';
import { useCouple, useCurrentUser } from '@/hooks/use-couple';

export const Route = createFileRoute('/_app')({ component: AppLayout });

type Sheet = 'entry' | 'invite' | 'menu' | null;

const TITLES: Record<Exclude<Sheet, null>, string> = {
  entry: 'Novo lançamento',
  invite: 'Convidar para o Duo',
  menu: 'Navegação',
};

function AppLayout() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const { data: couple } = useCouple();
  const { data: me } = useCurrentUser();
  const { data: categories } = useCategories();

  const close = () => setSheet(null);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar onInvite={() => setSheet('invite')} />

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
      >
        {sheet === 'entry' && couple && categories && me ? (
          <TransactionForm
            members={couple.members}
            categories={categories}
            viewerId={me.id}
            today={TODAY}
            onDone={close}
          />
        ) : null}

        {sheet === 'invite' && couple ? <InvitePanel couple={couple} onDone={close} /> : null}

        {sheet === 'menu' ? (
          <nav className="flex flex-col">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className="border-b border-line-soft py-3.5 text-section text-ink"
                activeProps={{ className: 'text-accent' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Modal>
    </div>
  );
}
