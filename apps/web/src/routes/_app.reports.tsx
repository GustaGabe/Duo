import { createFileRoute } from '@tanstack/react-router';

import { CategoryProgressList } from '@/components/finance/category-progress';
import { MonthPicker } from '@/components/finance/month-picker';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { EmptyState, Skeleton } from '@/components/ui/misc';
import { useCategories } from '@/hooks/use-categories';
import { useActiveSpace } from '@/hooks/use-spaces';
import { useMonthSummary } from '@/hooks/use-summary';
import { formatBRL, formatMonthLong } from '@/lib/format';
import { useSelectedMonthStore } from '@/lib/selected-month';

export const Route = createFileRoute('/_app/reports')({ component: ReportsPage });

function ReportsPage() {
  const month = useSelectedMonthStore((state) => state.month);
  const { space } = useActiveSpace();
  const { data: summary } = useMonthSummary(space?.id, month);
  const { data: categories } = useCategories(space?.id);

  if (!space || !summary || !categories) return <Skeleton className="h-96" />;

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle={`${space.name} · ${formatMonthLong(summary.month)}`}
        actions={<MonthPicker />}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="text-label text-muted">Entradas</p>
          <p className="tabular mt-2 text-heading text-ink">{formatBRL(summary.incomeCents)}</p>
        </Card>
        <Card>
          <p className="text-label text-muted">Saídas</p>
          <p className="tabular mt-2 text-heading text-ink">{formatBRL(summary.expenseCents)}</p>
        </Card>
        <Card>
          <p className="text-label text-muted">Saldo</p>
          <p className="tabular mt-2 text-heading text-ink">{formatBRL(summary.balanceCents)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-section text-ink">Gasto por categoria</h2>
        <CategoryProgressList categories={categories} byCategory={summary.byCategory} limit={10} />
      </Card>

      <Card>
        <EmptyState
          title="Gráficos chegam depois"
          description="A comparação entre meses e a evolução por categoria ainda não têm desenho."
        />
      </Card>
    </>
  );
}
