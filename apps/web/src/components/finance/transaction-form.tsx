import type { Category, TransactionKind, User } from '@duo/shared';
import { useMemo, useState } from 'react';

import { AmountKeypad } from '@/components/finance/amount-keypad';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Select } from '@/components/ui/field';
import { Segmented } from '@/components/ui/segmented';
import { Switch } from '@/components/ui/switch';
import { tv } from '@/lib/tv';
import { visibleCategories } from '@/lib/category';
import { digitsToCents, formatAmount, formatBRL } from '@/lib/format';
import { useCreateTransaction } from '@/hooks/use-transactions';

const payerOption = tv({
  base: 'h-11.5 cursor-pointer rounded-control border-[1.5px] px-3.5 text-left text-label font-medium transition-colors',
  variants: {
    slot: { a: '', b: '' },
    selected: { true: '', false: 'border-line bg-surface text-ink-soft hover:bg-surface-3' },
  },
  compoundVariants: [
    { slot: 'a', selected: true, class: 'border-owner-a bg-owner-a text-on-owner-a' },
    { slot: 'b', selected: true, class: 'border-owner-b bg-owner-b text-on-owner-b' },
  ],
  defaultVariants: { selected: false },
});

export interface TransactionFormProps {
  members: User[];
  categories: Category[];
  viewerId: string;
  today: string;
  defaultKind?: TransactionKind;
  onDone: () => void;
}

export function TransactionForm({
  members,
  categories,
  viewerId,
  today,
  defaultKind = 'expense',
  onDone,
}: TransactionFormProps) {
  const [kind, setKind] = useState<TransactionKind>(defaultKind);
  const [digits, setDigits] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);
  const [payer, setPayer] = useState<string>(members[0]?.id ?? '');
  const [recurring, setRecurring] = useState(false);

  const options = useMemo(
    () => visibleCategories(categories, viewerId).filter((category) => category.kind === kind),
    [categories, kind, viewerId],
  );
  const [categoryId, setCategoryId] = useState(options[0]?.id ?? '');
  const selectedCategory = options.find((category) => category.id === categoryId) ?? options[0];

  const cents = digitsToCents(digits);
  const create = useCreateTransaction();

  const payerChoices = [
    ...members.map((member) => ({
      value: member.id,
      label: member.name.split(' ')[0] ?? member.name,
      slot: member.slot,
    })),
    ...(kind === 'expense'
      ? [{ value: 'equal' as const, label: 'Dividir 50/50', slot: 'a' as const }]
      : []),
  ];

  const splitNote =
    payer === 'equal'
      ? `${formatBRL(Math.round(cents / 2))} para cada um.`
      : `Lançado no nome de ${members.find((member) => member.id === payer)?.name.split(' ')[0] ?? '—'}, visível para os dois.`;

  const canSubmit = cents > 0 && description.trim().length > 0 && Boolean(selectedCategory);

  async function submit() {
    if (!canSubmit || !selectedCategory) return;
    await create.mutateAsync({
      kind,
      description: description.trim(),
      amountCents: cents,
      categoryId: selectedCategory.id,
      payerId: payer === 'equal' ? (members[0]?.id ?? '') : payer,
      split: payer === 'equal' ? 'equal' : 'payer',
      date,
      recurring,
    });
    onDone();
  }

  return (
    <form
      className="flex flex-col gap-5 md:flex-row md:gap-7"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <Segmented
          aria-label="Tipo do lançamento"
          value={kind}
          onChange={(next) => {
            setKind(next);
            setPayer(members[0]?.id ?? '');
            setCategoryId('');
          }}
          options={[
            { value: 'expense', label: 'Saída' },
            { value: 'income', label: 'Entrada' },
          ]}
        />

        <div>
          <Label htmlFor="amount">Valor</Label>
          <div className="mt-1.5 flex items-baseline gap-2.5 border-b-[1.5px] border-line pb-3">
            <span className="text-title font-medium text-subtle">R$</span>
            <input
              id="amount"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0,00"
              value={digits ? formatAmount(cents) : ''}
              onChange={(event) => setDigits(event.target.value.replace(/\D/g, '').slice(0, 9))}
              className="tabular w-full min-w-0 bg-transparent text-money text-ink outline-none placeholder:text-subtle"
            />
          </div>
        </div>

        <Field label="Descrição">
          {(id) => (
            <Input
              id={id}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Mercado da esquina"
            />
          )}
        </Field>

        <div className="flex gap-3">
          <Field label="Categoria" className="flex-1">
            {(id) => (
              <Select
                id={id}
                value={selectedCategory?.id ?? ''}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                {options.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Data" className="flex-1">
            {(id) => (
              <Input
                id={id}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            )}
          </Field>
        </div>

      </div>

      <div className="flex shrink-0 flex-col gap-3 md:w-65">
        <div className="rounded-panel bg-surface-2 p-4">
          <p className="mb-3 text-caption text-muted">
            {kind === 'expense' ? 'Pago por' : 'Recebido por'}
          </p>
          <div className="flex flex-col gap-2">
            {payerChoices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                aria-pressed={payer === choice.value}
                onClick={() => setPayer(choice.value)}
                className={payerOption({
                  slot: choice.slot,
                  selected: payer === choice.value,
                })}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-caption leading-snug text-muted">{splitNote}</p>
        </div>

        <div className="flex items-center gap-2.5 rounded-panel border-[1.5px] border-line p-4">
          <Switch checked={recurring} onChange={setRecurring} label="Repetir todo mês" hideLabel />
          <span className="text-label text-ink-soft">Repetir todo mês</span>
        </div>

        <div className="flex-1" />

        <Button type="submit" block disabled={!canSubmit || create.isPending}>
          {create.isPending ? 'Salvando…' : kind === 'expense' ? 'Salvar despesa' : 'Adicionar entrada'}
        </Button>
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer text-center text-label text-muted transition-colors hover:text-ink"
        >
          Cancelar
        </button>
      </div>

      <AmountKeypad
        className="md:hidden"
        onPress={(digit) => setDigits((current) => (current + digit).slice(0, 9))}
        onDelete={() => setDigits((current) => current.slice(0, -1))}
      />
    </form>
  );
}
