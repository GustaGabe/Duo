import type { Space } from '@duo/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { JoinSpaceForm } from '@/components/spaces/join-space-form';
import { SpaceForm } from '@/components/spaces/space-form';
import { SpaceMembers } from '@/components/spaces/space-members';
import { SpaceMark } from '@/components/spaces/space-mark';
import { PageHeader } from '@/components/layout/page-header';
import { AvatarStack } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/misc';
import { useSession } from '@/hooks/use-session';
import { useActiveSpace } from '@/hooks/use-spaces';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/spaces')({ component: SpacesPage });

function SpacesPage() {
  const { space: active, spaces, tones, setSpaceId } = useActiveSpace();
  const { data: me } = useSession();
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [managing, setManaging] = useState<Space | null>(null);

  if (!spaces || !me) return <Skeleton className="h-96" />;

  const people = new Set(spaces.flatMap((space) => space.members.map((member) => member.id))).size;

  return (
    <>
      <PageHeader
        title="Espaços"
        subtitle={`${spaces.length} ${spaces.length === 1 ? 'espaço' : 'espaços'} · ${people} ${people === 1 ? 'pessoa' : 'pessoas'} ao todo`}
        actions={
          <div className="hidden gap-3 lg:flex">
            <Button variant="secondary" onClick={() => setJoining(true)}>
              Entrar com código
            </Button>
            <Button onClick={() => setCreating(true)}>+ Novo espaço</Button>
          </div>
        }
      />

      <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {spaces.map((space) => {
          const isActive = space.id === active?.id;
          const role = space.members.find((member) => member.id === me.id)?.role;

          return (
            <li key={space.id}>
              <Card
                className={cn(
                  'flex h-full flex-col gap-4 transition-colors',
                  isActive && 'border-accent',
                )}
              >
                <div className="flex items-start gap-3.5">
                  <SpaceMark space={space} tone={tones[space.id]} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-section text-ink">{space.name}</p>
                    <p className="text-caption text-muted">
                      {space.members.length}{' '}
                      {space.members.length === 1 ? 'pessoa' : 'pessoas'}
                      {role === 'owner' ? ' · você é dono' : ''}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="rounded-pill bg-accent px-3 py-1 text-micro font-semibold text-on-accent">
                      Ativo
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <AvatarStack people={space.members} size="lg" />
                  <p className="font-mono text-micro tracking-[0.12em] text-subtle">{space.code}</p>
                </div>

                <div className="flex-1" />

                <div className="flex gap-2.5">
                  <Button
                    variant={isActive ? 'subtle' : 'primary'}
                    size="sm"
                    block
                    disabled={isActive}
                    onClick={() => setSpaceId(space.id)}
                  >
                    {isActive ? 'Em uso' : 'Usar este'}
                  </Button>
                  <Button variant="secondary" size="sm" block onClick={() => setManaging(space)}>
                    Pessoas
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex h-full min-h-45 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-[1.5px] border-dashed border-line-dashed text-ink-soft transition-colors hover:bg-surface-2"
          >
            <span className="grid size-11 place-items-center rounded-field bg-surface-2 text-xl">
              +
            </span>
            <span className="text-body font-medium text-accent">Criar espaço</span>
            <span className="max-w-52 text-center text-caption text-muted">
              Uma casa, uma viagem, um projeto — cada um com suas próprias contas.
            </span>
          </button>
        </li>
      </ul>

      <Button variant="secondary" block className="lg:hidden" onClick={() => setJoining(true)}>
        Entrar com código
      </Button>

      <Modal open={creating} onClose={() => setCreating(false)} title="Novo espaço" size="sm">
        <SpaceForm onDone={() => setCreating(false)} />
      </Modal>

      <Modal open={joining} onClose={() => setJoining(false)} title="Entrar em um espaço" size="sm">
        <JoinSpaceForm onDone={() => setJoining(false)} />
      </Modal>

      <Modal
        open={managing !== null}
        onClose={() => setManaging(null)}
        title={managing ? `Pessoas em ${managing.name}` : ''}
        description="As mesmas pessoas podem participar de vários espaços."
        size="sm"
      >
        {managing ? (
          <SpaceMembers
            space={spaces.find((space) => space.id === managing.id) ?? managing}
            viewerId={me.id}
          />
        ) : null}
      </Modal>
    </>
  );
}
