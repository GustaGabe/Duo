import type { Category, CategorySummary } from '@duo/shared';

import { Progress } from '@/components/ui/progress';
import { formatBRL } from '@/lib/format';

export function CategoryProgressList({
  categories,
  byCategory,
  limit = 4,
}: {
  categories: Category[];
  byCategory: CategorySummary[];
  limit?: number;
}) {
  const rows = byCategory
    .map((entry) => ({
      entry,
      category: categories.find((category) => category.id === entry.categoryId),
    }))
    .filter((row) => row.category?.kind === 'expense' && row.entry.spentCents > 0)
    .toSorted((a, b) => b.entry.spentCents - a.entry.spentCents)
    .slice(0, limit);

  const top = rows[0]?.entry.spentCents ?? 1;

  if (rows.length === 0) {
    return (
      <p className="text-body text-muted">
        Nenhum gasto por categoria neste mês.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3.5">
      {rows.map(({ entry, category }) => (
        <li key={entry.categoryId}>
          <div className="mb-1.5 flex justify-between text-label text-ink-soft">
            <span>{category?.name}</span>
            <span className="tabular font-semibold text-ink">{formatBRL(entry.spentCents)}</span>
          </div>
          <Progress
            value={(entry.spentCents / top) * 100}
            label={`Gasto em ${category?.name ?? ''}`}
          />
        </li>
      ))}
    </ul>
  );
}
