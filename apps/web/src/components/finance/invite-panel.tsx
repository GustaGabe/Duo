import type { Couple } from '@duo/shared';
import { useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { useSendInvite } from '@/hooks/use-couple';

const CHANNELS = ['Link', 'WhatsApp', 'QR'];

export function InvitePanel({ couple, onDone }: { couple: Couple; onDone?: () => void }) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const send = useSendInvite();

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(couple.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="rounded-card border-[1.5px] border-line p-4.5">
        <p className="mb-2.5 text-caption text-muted">Código do casal</p>
        <div className="flex items-center gap-2.5">
          <p className="flex-1 font-mono text-heading font-medium tracking-[0.22em] text-ink">
            {couple.code}
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
      </div>

      <div className="flex gap-2.5">
        {CHANNELS.map((channel) => (
          <Button key={channel} variant="secondary" block className="h-13">
            {channel}
          </Button>
        ))}
      </div>

      {couple.invites.length > 0 ? (
        <div className="rounded-panel bg-surface-2 p-4">
          <p className="mb-3 text-caption text-muted">Pendente</p>
          <ul className="flex flex-col gap-3">
            {couple.invites.map((invite) => (
              <li key={invite.id} className="flex items-center gap-3">
                <Avatar name={invite.email} slot="b" size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{invite.email}</p>
                  <p className="text-caption text-muted">Convite enviado</p>
                </div>
                <span className="rounded-pill bg-surface px-3 py-1.5 font-mono text-nano tracking-[0.1em] text-accent">
                  AGUARDA
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button
        block
        size="lg"
        className="mt-1"
        disabled={!email.includes('@') || send.isPending}
        onClick={() => {
          send.mutate(email, { onSuccess: () => setEmail('') });
        }}
      >
        {send.isPending ? 'Enviando…' : 'Enviar convite'}
      </Button>
      {onDone ? (
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer text-center text-sm text-muted transition-colors hover:text-ink"
        >
          Depois eu convido
        </button>
      ) : null}
    </div>
  );
}
