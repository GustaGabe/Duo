import type { Transaction } from '@duo/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { TODAY } from '@/lib/clock';
import { TransactionForm } from '@/components/finance/transaction-form';
import { TransactionItem } from '@/components/finance/transaction-item';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { Money } from '@/components/ui/money';
import { Skeleton } from '@/components/ui/misc';
import { TagSquare } from '@/components/ui/tag-square';
import { useCategories } from '@/hooks/use-categories';
import { useActiveSpace, useCurrentUser } from '@/hooks/use-spaces';
import { useTransactions } from '@/hooks/use-transactions';
import { cn } from '@/lib/cn';
import { formatRelativeDay } from '@/lib/format';
import { ownerDot } from '@/lib/owner';

export const Route = createFileRoute('/_app/transactions')({ component: Lancamentos });

function Lancamentos() {
  const [owner, setOwner] = useState('all');
  const [creating, setCreating] = useState(false);
  const { space } = useActiveSpace();
  const { data: me } = useCurrentUser();
  const { data: categories } = useCategories(space?.id);
  const { data: transactions } = useTransactions(space ? { spaceId: space.id, owner } : undefined);

  if (!space || !categories || !transactions || !me) return <Skeleton className="h-96" />;

  const category = (id: string) => categories.find((item) => item.id === id);
  const payer = (id: string) => space.members.find((member) => member.id === id);

  const filters = [
    { value: 'all', label: 'Ambos' },
    ...space.members.map((member) => ({
      value: member.id,
      label: member.name.split(' ')[0] ?? member.name,
    })),
  ];

  const columns: Column<Transaction>[] = [
    {
      id: 'description',
      header: 'Descrição',
      width: '2.2fr',
      render: (row) => (
        <div className="flex items-center gap-3">
          <TagSquare tag={category(row.categoryId)?.tag ?? '??'} color={category(row.categoryId)?.color} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{row.description}</p>
            <p className="text-micro text-subtle">{formatRelativeDay(row.date, TODAY)}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Categoria',
      width: '1fr',
      render: (row) => <span className="text-label text-ink-soft">{category(row.categoryId)?.name}</span>,
    },
    {
      id: 'who',
      header: 'Quem',
      width: '1fr',
      render: (row) => {
        const person = payer(row.payerId);
        return (
          <span className="flex items-center gap-1.5 text-label text-ink-soft">
            {person ? <span className={cn('size-1.75 rounded-pill', ownerDot[person.slot])} /> : null}
            {row.split === 'equal' ? 'Dividido' : (person?.name.split(' ')[0] ?? '—')}
          </span>
        );
      },
    },
    {
      id: 'amount',
      header: 'Valor',
      width: '0.9fr',
      align: 'right',
      render: (row) => <Money cents={row.amountCents} kind={row.kind} className="text-sm" />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Lançamentos"
        subtitle={`${space.name} · ${transactions.length} lançamentos neste mês`}
        actions={
          <div className="hidden items-center gap-3 lg:flex">
            {filters.map((filter) => (
              <Chip key={filter.value} selected={owner === filter.value} onClick={() => setOwner(filter.value)}>
                {filter.label}
              </Chip>
            ))}
            <Button onClick={() => setCreating(true)}>+ Novo lançamento</Button>
          </div>
        }
      />

      <div className="flex gap-2 lg:hidden">
        {filters.map((filter) => (
          <Chip key={filter.value} selected={owner === filter.value} onClick={() => setOwner(filter.value)}>
            {filter.label}
          </Chip>
        ))}
      </div>

      <Card className="hidden min-h-0 flex-1 flex-col lg:flex lg:p-5.5">
        <DataTable columns={columns} rows={transactions} getRowKey={(row) => row.id} />
      </Card>

      <Card className="lg:hidden">
        <ul className="flex flex-col divide-y divide-line-soft">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionItem
                transaction={transaction}
                category={category(transaction.categoryId)}
                payer={payer(transaction.payerId)}
                today={TODAY}
              />
            </li>
          ))}
        </ul>
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="Novo lançamento" size="lg">
        <TransactionForm
          spaceId={space.id}
          members={space.members}
          categories={categories}
          viewerId={me.id}
          today={TODAY}
          onDone={() => setCreating(false)}
        />
      </Modal>
    </>
  );
}
