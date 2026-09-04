import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';

import { AuthShell } from '@/components/layout/auth-shell';
import { InvitePanel } from '@/components/finance/invite-panel';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton, Stepper } from '@/components/ui/misc';
import { useCouple } from '@/hooks/use-couple';

export const Route = createFileRoute('/_public/invite')({ component: InvitePage });

function InvitePage() {
  const navigate = useNavigate();
  const { data: couple } = useCouple();

  return (
    <AuthShell>
      <div className="mt-6 flex items-center justify-between">
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
        <Avatar name="Ana" slot="a" size="xl" ringed />
        <span className="-ml-3.5 grid size-16.5 place-items-center rounded-pill border-2 border-dashed border-line-dashed bg-surface-2 text-2xl text-subtle">
          +
        </span>
      </div>

      <h1 className="mt-7 text-center text-heading text-ink">
        Convide quem
        <br />
        divide a vida.
      </h1>
      <p className="mx-auto mt-2 max-w-72 text-center text-sm leading-relaxed text-muted">
        Vocês passam a ver o mesmo painel — cada lançamento continua marcado com o nome de quem
        gastou.
      </p>

      <div className="mt-7">
        {couple ? (
          <InvitePanel couple={couple} onDone={() => void navigate({ to: '/dashboard' })} />
        ) : (
          <Skeleton className="h-72" />
        )}
      </div>
    </AuthShell>
  );
}
