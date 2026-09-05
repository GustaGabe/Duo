import type { Category } from '@duo/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';


import { CategoryForm } from '@/components/finance/category-form';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Input } from '@/components/ui/field';
import { Modal } from '@/components/ui/modal';
import { Progress } from '@/components/ui/progress';
import { EmptyState, Skeleton } from '@/components/ui/misc';
import { TagSquare } from '@/components/ui/tag-square';
import { useCategories } from '@/hooks/use-categories';
import { useSession } from '@/hooks/use-session';
import { useActiveSpace } from '@/hooks/use-spaces';
import { useMonthSummary } from '@/hooks/use-summary';
import { visibleCategories } from '@/lib/category';
import { formatBRL } from '@/lib/format';

export const Route = createFileRoute('/_app/categories')({ component: Categorias });

type Filter = 'all' | 'expense' | 'income';

function Categorias() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const { space } = useActiveSpace();
  const { data: categories } = useCategories(space?.id);
  const { data: me } = useSession();
  const { data: summary } = useMonthSummary(space?.id);

  if (!space || !categories || !summary || !me) return <Skeleton className="h-96" />;

  const mine = visibleCategories(categories, me.id);

  const rows = mine
    .filter((category) => filter === 'all' || category.kind === filter)
    .filter((category) => category.name.toLowerCase().includes(search.trim().toLowerCase()));

  const spent = (id: string) =>
    summary.byCategory.find((entry) => entry.categoryId === id)?.spentCents ?? 0;
  const usage = (category: Category) =>
    category.monthlyLimitCents ? (spent(category.id) / category.monthlyLimitCents) * 100 : 0;

  const shared = mine.filter((category) => category.scope === 'shared').length;

  const columns: Column<Category>[] = [
    {
      id: 'category',
      header: 'Categoria',
      width: '2fr',
      render: (row) => (
        <div className="flex items-center gap-3">
          <TagSquare tag={row.tag} color={row.color} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{row.name}</p>
            <p className="truncate text-micro text-subtle">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'kind',
      header: 'Tipo',
      width: '1fr',
      render: (row) => (
        <span className="text-label text-ink-soft">{row.kind === 'income' ? 'Entrada' : 'Saída'}</span>
      ),
    },
    {
      id: 'limit',
      header: 'Limite / uso',
      width: '1.2fr',
      render: (row) => (
        <div className="pr-6">
          <p className="mb-1.5 text-caption text-ink-soft">
            {formatBRL(spent(row.id))}
            {row.monthlyLimitCents
              ? ` de ${row.kind === 'income' ? 'meta ' : ''}${formatBRL(row.monthlyLimitCents)}`
              : ' · sem limite'}
          </p>
          <Progress
            value={usage(row)}
            label={`Uso de ${row.name}`}
            barClassName={usage(row) >= 80 ? 'bg-accent' : 'bg-ink'}
            className="h-1.75"
          />
        </div>
      ),
    },
    {
      id: 'scope',
      header: 'Visibilidade',
      width: '1fr',
      align: 'right',
      render: (row) => (
        <span className="text-caption text-ink-soft">{row.scope === 'shared' ? 'Casal' : 'Só você'}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle={`${space.name} · ${mine.length} categorias · ${shared} compartilhadas`}
        actions={
          <div className="hidden gap-3 lg:flex">
            <Button variant="secondary">Importar padrão</Button>
            <Button onClick={() => setCreating(true)}>+ Nova categoria</Button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar categoria"
          className="lg:max-w-xs"
        />
        <div className="flex gap-2">
          <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
            Todas · {mine.length}
          </Chip>
          <Chip selected={filter === 'expense'} onClick={() => setFilter('expense')}>
            Saídas
          </Chip>
          <Chip selected={filter === 'income'} onClick={() => setFilter('income')}>
            Entradas
          </Chip>
        </div>
      </div>

      <Card className="hidden min-h-0 flex-1 flex-col lg:flex lg:p-5.5">
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          empty="Nenhuma categoria por aqui ainda."
        />
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mt-4 h-13 cursor-pointer rounded-field border-[1.5px] border-dashed border-line-dashed text-sm font-medium text-accent transition-colors hover:bg-surface-2"
        >
          + Criar categoria
        </button>
      </Card>

      <Card className="lg:hidden">
        {rows.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria ainda"
            description="Categorias organizam os lançamentos e dão o limite mensal de cada tipo de gasto."
          />
        ) : null}
        <ul className="flex flex-col divide-y divide-line-soft">
          {rows.map((category) => (
            <li key={category.id} className="flex items-center gap-3.5 py-3">
              <TagSquare tag={category.tag} color={category.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-ink">{category.name}</p>
                <p className="truncate text-caption text-muted">{category.description}</p>
              </div>
              <div className="text-right">
                <p className="tabular text-sm font-semibold text-ink">{formatBRL(spent(category.id))}</p>
                <p className="text-micro text-subtle">
                  {category.monthlyLimitCents ? formatBRL(category.monthlyLimitCents) : 'sem limite'}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Button block className="mt-4" onClick={() => setCreating(true)}>
          + Nova categoria
        </Button>
      </Card>

      <Modal open={creating} onClose={() => setCreating(false)} title="Nova categoria" size="sm">
        <CategoryForm spaceId={space.id} onDone={() => setCreating(false)} />
      </Modal>
    </>
  );
}
