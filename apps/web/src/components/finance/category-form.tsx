import type { Category, CategoryColor, CategoryScope, TransactionKind } from '@duo/shared';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input, Label } from '@/components/ui/field';
import { Segmented } from '@/components/ui/segmented';
import { ColorSwatch, TagSquare } from '@/components/ui/tag-square';
import { useCreateCategory } from '@/hooks/use-categories';
import { CATEGORY_COLORS, suggestTag } from '@/lib/category';
import { digitsToCents, formatAmount } from '@/lib/format';

export function CategoryForm({
  spaceId,
  defaultKind = 'expense',
  onDone,
}: {
  spaceId: string;
  defaultKind?: TransactionKind;
  onDone: (category: Category) => void;
}) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [kind, setKind] = useState<TransactionKind>(defaultKind);
  const [color, setColor] = useState<CategoryColor>('accent');
  const [limitDigits, setLimitDigits] = useState('');
  const [shared] = useState(true);

  const create = useCreateCategory();
  const badge = tag || (name ? suggestTag(name) : '??');
  const limitCents = digitsToCents(limitDigits);

  async function submit() {
    if (!name.trim()) return;
    const scope: CategoryScope = shared ? 'shared' : 'private';
    const category = await create.mutateAsync({
      spaceId,
      name: name.trim(),
      tag: badge,
      description: shared ? 'Compartilhada com o espaço' : 'Só aparece para você',
      kind,
      color,
      monthlyLimitCents: limitCents > 0 ? limitCents : null,
      scope,
    });

    onDone(category);
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

      <div className="flex w-full gap-2">
        <Field label="Nome" className="flex-1">
          {(id) => (
            <Input
              id={id}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Pets"
              autoFocus
              className="w-full"
            />
          )}
        </Field>

        <Field label="Sigla" className="w-15">
          {(id) => (
            <Input
              id={id}
              value={tag}
              maxLength={2}
              placeholder={suggestTag(name || 'Nova')}
              onChange={(event) => setTag(event.target.value.toUpperCase())}
              className="w-15 font-mono tracking-widest uppercase"
            />
          )}
        </Field>
      </div>

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

      <Field
        label={kind === 'income' ? 'Meta mensal (opcional)' : 'Limite mensal (opcional)'}
        hint={limitCents > 0 ? 'Alerta em 80% do limite.' : undefined}
      >
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

      <Button type="submit" size="lg" block disabled={!name.trim() || create.isPending}>
        {create.isPending ? 'Salvando…' : 'Salvar categoria'}
      </Button>
    </form>
  );
}
