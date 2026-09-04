import type { CategoryColor, CategoryScope, TransactionKind } from '@duo/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input, Label } from '@/components/ui/field';
import { Segmented } from '@/components/ui/segmented';
import { Switch } from '@/components/ui/switch';
import { ColorSwatch, TagSquare } from '@/components/ui/tag-square';
import { useCreateCategory } from '@/hooks/use-categories';
import { CATEGORY_COLORS, suggestTag } from '@/lib/category';
import { cn } from '@/lib/cn';
import { digitsToCents, formatAmount } from '@/lib/format';

export function CategoryForm({ ownerId, onDone }: { ownerId: string; onDone: () => void }) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [kind, setKind] = useState<TransactionKind>('expense');
  const [color, setColor] = useState<CategoryColor>('accent');
  const [limitDigits, setLimitDigits] = useState('');
  const [shared, setShared] = useState(true);

  const create = useCreateCategory();
  const badge = tag || (name ? suggestTag(name) : '??');
  const limitCents = digitsToCents(limitDigits);

  async function submit() {
    if (!name.trim()) return;
    const scope: CategoryScope = shared ? 'shared' : 'private';
    await create.mutateAsync({
      name: name.trim(),
      tag: badge,
      description: shared ? 'Compartilhada com o casal' : 'Só aparece para você',
      kind,
      color,
      monthlyLimitCents: limitCents > 0 ? limitCents : null,
      scope,
      ownerId: scope === 'private' ? ownerId : null,
    });
    onDone();
  }

  return (
    <form
      className="flex flex-col gap-4.5"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="flex items-center gap-4 rounded-card bg-surface-2 p-4.5">
        <TagSquare tag={badge} color={color} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-section text-ink">{name || 'Nova categoria'}</p>
          <p className="text-caption text-muted">Pré-visualização na lista</p>
        </div>
      </div>

      <Field label="Nome">
        {(id) => (
          <Input
            id={id}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Pets"
            autoFocus
          />
        )}
      </Field>

      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <Segmented
          aria-label="Tipo da categoria"
          shape="block"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'expense', label: 'Saída' },
            { value: 'income', label: 'Entrada' },
          ]}
        />
      </div>

      <Field label="Sigla" hint="Duas letras que aparecem no quadradinho da lista.">
        {(id) => (
          <Input
            id={id}
            value={tag}
            maxLength={2}
            placeholder={suggestTag(name || 'Nova')}
            onChange={(event) => setTag(event.target.value.toUpperCase())}
            className="w-24 font-mono tracking-widest uppercase"
          />
        )}
      </Field>

      <div className="flex flex-col gap-2.5">
        <Label>Cor</Label>
        <div className="flex gap-2.5">
          {CATEGORY_COLORS.map((option) => (
            <ColorSwatch
              key={option}
              color={option}
              selected={color === option}
              onSelect={() => setColor(option)}
            />
          ))}
        </div>
      </div>

      <Field label="Limite mensal (opcional)" hint={limitCents > 0 ? 'Alerta em 80% do limite.' : undefined}>
        {(id) => (
          <Input
            id={id}
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={limitDigits ? `R$ ${formatAmount(limitCents)}` : ''}
            onChange={(event) => setLimitDigits(event.target.value.replace(/\D/g, '').slice(0, 9))}
          />
        )}
      </Field>

      <div className={cn('flex items-center gap-3 rounded-panel bg-surface-2 p-4')}>
        <p className="flex-1 text-label leading-snug text-ink-soft">
          Compartilhar com o casal — aparece no painel dos dois.
        </p>
        <Switch checked={shared} onChange={setShared} label="Compartilhar categoria" hideLabel />
      </div>

      <Button type="submit" size="lg" block disabled={!name.trim() || create.isPending}>
        {create.isPending ? 'Salvando…' : 'Salvar categoria'}
      </Button>
    </form>
  );
}
