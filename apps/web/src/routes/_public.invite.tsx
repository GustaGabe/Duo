import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';

import { SpaceMembers } from '@/components/spaces/space-members';
import { AuthShell } from '@/components/layout/auth-shell';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton, Stepper } from '@/components/ui/misc';
import { useSession } from '@/hooks/use-session';
import { useSpaces } from '@/hooks/use-spaces';

export const Route = createFileRoute('/_public/invite')({ component: InvitePage });

function InvitePage() {
  const navigate = useNavigate();
  const { data: spaces } = useSpaces();
  const { data: me } = useSession();
  const first = spaces?.[0];

  return (
    <AuthShell logo={false}>
      <div className="flex items-center justify-between">
        <Link
          to="/signup"
          aria-label="Voltar"
          className="grid size-10 place-items-center rounded-control border-[1.5px] border-line text-lg text-ink"
        >
          ←
        </Link>
        <p className="font-mono text-micro tracking-[0.12em] text-muted">PASSO 2 DE 2</p>
      </div>

      <Stepper current={2} total={2} className="mt-6" />

      <div className="mt-7 flex items-center justify-center">
        <Avatar name={me?.name ?? 'Você'} slot="a" size="xl" ringed />
        <span className="-ml-3.5 grid size-16.5 place-items-center rounded-pill border-2 border-dashed border-line-dashed bg-surface-2 text-2xl text-subtle">
          +
        </span>
      </div>

      <h1 className="mt-7 text-center text-heading text-ink">
        Convide quem
        <br />
        divide a conta.
      </h1>
      <p className="mx-auto mt-2 max-w-72 text-center text-sm leading-relaxed text-muted">
        Vocês passam a ver o mesmo espaço — cada lançamento continua marcado com o nome de quem
        gastou.
      </p>

      <div className="mt-7">
        {first && me ? (
          <>
            <SpaceMembers space={first} viewerId={me.id} />
            <Button
              variant="ghost"
              block
              className="mt-3"
              onClick={() => void navigate({ to: '/dashboard' })}
            >
              Depois eu convido
            </Button>
          </>
        ) : (
          <Skeleton className="h-72" />
        )}
      </div>
    </AuthShell>
  );
}
