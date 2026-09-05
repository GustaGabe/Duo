import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import { TODAY } from '@/lib/clock';
import { CategoryProgressList } from '@/components/finance/category-progress';
import { SettlementCard } from '@/components/finance/settlement-card';
import {
  BalanceCard,
  BalanceHero,
  InOutCard,
  PersonSpendCard,
  WhoSpent,
} from '@/components/finance/summary-cards';
import { TransactionItem } from '@/components/finance/transaction-item';
import { PageHeader, ThemeToggle } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/misc';
import { useCategories } from '@/hooks/use-categories';
import { useActiveSpace } from '@/hooks/use-spaces';
import { useMonthSummary } from '@/hooks/use-summary';
import { useTransactions } from '@/hooks/use-transactions';
import { formatMonthLong } from '@/lib/format';

export const Route = createFileRoute('/_app/dashboard')({ component: Painel });

function Painel() {
  const [owner, setOwner] = useState('all');
  const { space } = useActiveSpace();
  const { data: categories } = useCategories(space?.id);
  const { data: summary } = useMonthSummary(space?.id);
  const { data: transactions } = useTransactions(
    space ? { spaceId: space.id, owner, limit: 6 } : undefined,
  );

  if (!space || !summary || !categories) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const filters = [
    { value: 'all', label: 'Ambos' },
    ...space.members.map((member) => ({
      value: member.id,
      label: member.name.split(' ')[0] ?? member.name,
    })),
  ];

  return (
    <>
      <div className="hidden lg:block">
        <PageHeader
          title={formatMonthLong(summary.month)}
          subtitle={`${space.name} · ${space.members.length} ${space.members.length === 1 ? 'pessoa' : 'pessoas'}`}
          actions={
            <>
              <ThemeToggle />
              <Button variant="secondary">Este mês</Button>
              <Button variant="secondary">Exportar</Button>
            </>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr_1fr]">
        <div className="lg:hidden">
          <BalanceHero summary={summary} />
          <InOutCard summary={summary} className="mt-4.5" />
        </div>

        <div className="hidden lg:block">
          <BalanceCard summary={summary} />
        </div>

        {space.members.map((member) => (
          <div key={member.id} className="hidden lg:block">
            <PersonSpendCard member={member} summary={summary} />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        <WhoSpent summary={summary} members={space.members} />
      </div>

      <div className="grid min-h-0 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="flex flex-col gap-3 lg:p-5.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
            <h2 className="text-section text-ink">Lançamentos recentes</h2>
            <div className="hidden flex-1 lg:block" />
            <div className="flex gap-2">
            {filters.map((filter) => (
              <Chip
                key={filter.value}
                selected={owner === filter.value}
                onClick={() => setOwner(filter.value)}
              >
                {filter.label}
              </Chip>
            ))}
            </div>
          </div>

          <ul className="flex flex-col divide-y divide-line-soft">
            {(transactions ?? []).map((transaction) => (
              <li key={transaction.id}>
                <TransactionItem
                  transaction={transaction}
                  category={categories.find((category) => category.id === transaction.categoryId)}
                  payer={space.members.find((member) => member.id === transaction.payerId)}
                  today={TODAY}
                />
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="lg:p-5.5">
            <h2 className="mb-4 text-body font-semibold text-ink">Por categoria</h2>
            <CategoryProgressList categories={categories} byCategory={summary.byCategory} />
          </Card>
          <SettlementCard summary={summary} members={space.members} onSettle={() => undefined} />
        </div>
      </div>
    </>
  );
}
