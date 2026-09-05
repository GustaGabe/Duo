import { Link, Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { TransactionForm } from '@/components/finance/transaction-form';
import { SpaceForm } from '@/components/spaces/space-form';
import { SpaceSwitcher } from '@/components/spaces/space-switcher';
import { BottomNav } from '@/components/layout/bottom-nav';
import { MobileTopBar } from '@/components/layout/page-header';
import { SIDEBAR_ITEMS } from '@/components/layout/nav';
import { navRow, wipBadge } from '@/components/layout/nav-link';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useCategories } from '@/hooks/use-categories';
import { useSession, useSignOut } from '@/hooks/use-session';
import { useActiveSpace } from '@/hooks/use-spaces';
import { today } from '@/lib/clock';
import { loadSession } from '@/hooks/use-session';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    const session = await loadSession(context.queryClient);

    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: AppLayout,
});

type Sheet = 'entry' | 'switch' | 'new-space' | 'menu' | 'sign-out' | null;

const TITLES: Record<Exclude<Sheet, null>, string> = {
  entry: 'Novo lançamento',
  switch: 'Trocar de espaço',
  'new-space': 'Novo espaço',
  menu: 'Navegação',
  'sign-out': 'Sair da conta',
};

function AppLayout() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const navigate = useNavigate();
  const { space, spaces, tones, setSpaceId } = useActiveSpace();
  const { data: me } = useSession();
  const signOutMutation = useSignOut();
  const { data: categories } = useCategories(space?.id);

  const close = () => setSheet(null);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar onSwitchSpace={() => setSheet('switch')} onSignOut={() => setSheet('sign-out')} />

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
            today={today()}
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
          <div className="flex flex-col gap-4">
            <nav className="flex flex-col divide-y divide-line-soft">
              {SIDEBAR_ITEMS.map((item) => (
                <Link key={item.to} to={item.to} onClick={close} className={navRow()}>
                  {item.label}
                  {item.wip ? <span className={wipBadge()}>WIP</span> : null}
                </Link>
              ))}
            </nav>
            <Button variant="secondary" block onClick={() => setSheet('sign-out')}>
              Sair da conta
            </Button>
          </div>
        ) : null}

        {sheet === 'sign-out' ? (
          <div className="flex flex-col gap-6">
            <p className="text-body text-ink-soft">
              Você vai precisar entrar de novo para ver os lançamentos do espaço.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" block onClick={close}>
                Cancelar
              </Button>
              <Button
                block
                disabled={signOutMutation.isPending}
                onClick={() =>
                  signOutMutation.mutate(undefined, {
                    onSettled: () => void navigate({ to: '/login' }),
                  })
                }
              >
                {signOutMutation.isPending ? 'Saindo…' : 'Sair'}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
