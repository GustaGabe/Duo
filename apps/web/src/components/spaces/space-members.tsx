import type { Space } from '@duo/shared';
import { useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { useInviteToSpace, useRemoveMember } from '@/hooks/use-spaces';

const CHANNELS = ['Link', 'WhatsApp', 'QR'];

export function SpaceMembers({ space, viewerId }: { space: Space; viewerId: string }) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const invite = useInviteToSpace();
  const remove = useRemoveMember();

  const canManage = space.ownerId === viewerId;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(space.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="eyebrow mb-3">
          {space.members.length} {space.members.length === 1 ? 'pessoa' : 'pessoas'}
        </p>
        <ul className="flex flex-col divide-y divide-line-soft">
          {space.members.map((member) => (
            <li key={member.id} className="flex items-center gap-3 py-2.5">
              <Avatar name={member.name} slot={member.slot} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-ink">
                  {member.name}
                  {member.id === viewerId ? <span className="text-muted"> · você</span> : null}
                </p>
                <p className="truncate text-caption text-muted">{member.email}</p>
              </div>
              <span className="rounded-pill bg-surface-2 px-3 py-1 text-micro font-medium text-ink-soft">
                {member.role === 'owner' ? 'Dono' : 'Membro'}
              </span>
              {canManage && member.role !== 'owner' ? (
                <button
                  type="button"
                  aria-label={`Remover ${member.name}`}
                  onClick={() => remove.mutate({ spaceId: space.id, userId: member.id })}
                  className="cursor-pointer px-1 text-caption text-muted transition-colors hover:text-accent"
                >
                  Remover
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border-[1.5px] border-line p-4.5">
        <p className="mb-2.5 text-caption text-muted">Código do espaço</p>
        <div className="flex items-center gap-2.5">
          <p className="flex-1 font-mono text-heading font-medium tracking-[0.22em] text-ink">
            {space.code}
          </p>
          <Button variant="action" size="sm" onClick={() => void copyCode()}>
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>
        <div className="my-4 h-px bg-line" />
        <p className="mb-2 text-caption text-muted">Ou envie por e-mail</p>
        <Input
          type="email"
          placeholder="nome@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="mt-2.5 flex gap-2.5">
          {CHANNELS.map((channel) => (
            <Button key={channel} variant="secondary" block className="h-11">
              {channel}
            </Button>
          ))}
        </div>
      </div>

      {space.invites.length > 0 ? (
        <div className="rounded-panel bg-surface-2 p-4">
          <p className="mb-3 text-caption text-muted">Convites pendentes</p>
          <ul className="flex flex-col gap-3">
            {space.invites.map((pending) => (
              <li key={pending.id} className="flex items-center gap-3">
                <span className="grid size-9.5 shrink-0 place-items-center rounded-pill border-2 border-dashed border-line-dashed text-caption text-subtle">
                  ?
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{pending.email}</p>
                <span className="rounded-pill bg-surface px-3 py-1.5 font-mono text-nano tracking-[0.1em] text-accent">
                  AGUARDA
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        size="lg"
        block
        disabled={!email.includes('@') || invite.isPending}
        onClick={() =>
          invite.mutate({ spaceId: space.id, email }, { onSuccess: () => setEmail('') })
        }
      >
        {invite.isPending ? 'Enviando…' : 'Enviar convite'}
      </Button>
    </div>
  );
}
