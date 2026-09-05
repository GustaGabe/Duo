import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { errorMessage } from '@/hooks/use-session';
import { useJoinSpace } from '@/hooks/use-spaces';

export function JoinSpaceForm({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const join = useJoinSpace();
  const failure = errorMessage(join.error);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        join.mutate(code.trim().toUpperCase(), { onSuccess: onDone });
      }}
    >
      <p className="text-body text-ink-soft">
        Peça o código para quem já está no espaço. Ele fica na tela de pessoas, no formato{' '}
        <span className="font-mono">DUO-XXXX</span>.
      </p>

      <Field label="Código do espaço">
        {(id) => (
          <Input
            id={id}
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="DUO-4F92"
            autoFocus
            maxLength={8}
            className="font-mono tracking-[0.18em] uppercase"
          />
        )}
      </Field>

      {failure ? (
        <p role="alert" className="text-caption font-medium text-accent">
          {failure}
        </p>
      ) : null}

      <Button type="submit" size="lg" block disabled={code.trim().length < 8 || join.isPending}>
        {join.isPending ? 'Entrando…' : 'Entrar no espaço'}
      </Button>
    </form>
  );
}
