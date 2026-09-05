import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { useCreateSpace } from '@/hooks/use-spaces';

import { SpaceMark } from './space-mark';

const SUGGESTIONS = ['Casa', 'Viagem', 'República', 'Reforma', 'Casamento'];

export function SpaceForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const create = useCreateSpace();

  const preview = { id: `preview-${name.length}`, name: name || 'Novo espaço' };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) return;
        create.mutate({ name: name.trim() }, { onSuccess: onDone });
      }}
    >
      <div className="flex items-center gap-4 rounded-card bg-surface-2 p-4.5">
        <SpaceMark space={preview} tone="c" size="lg" />
        <div className="min-w-0">
          <p className="truncate text-section text-ink">{preview.name}</p>
          <p className="text-caption text-muted">Você entra como dono</p>
        </div>
      </div>

      <Field label="Nome do espaço">
        {(id) => (
          <Input
            id={id}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Viagem ao Chile"
            autoFocus
            maxLength={40}
          />
        )}
      </Field>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setName(suggestion)}
            className="cursor-pointer rounded-pill border-[1.5px] border-line px-3.5 py-1.5 text-caption text-ink-soft transition-colors hover:bg-surface-2"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <p className="text-caption leading-snug text-muted">
        Cada espaço tem lançamentos, categorias e acerto próprios. Você convida quem quiser depois —
        as mesmas pessoas podem estar em vários espaços.
      </p>

      <Button type="submit" size="lg" block disabled={!name.trim() || create.isPending}>
        {create.isPending ? 'Criando…' : 'Criar espaço'}
      </Button>
    </form>
  );
}
