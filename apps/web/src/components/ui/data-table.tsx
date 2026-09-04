import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface Column<T> {
  id: string;
  header: string;
  width: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  empty,
  className,
}: DataTableProps<T>) {
  const template = columns.map((column) => column.width).join(' ');

  return (
    <div className={cn('flex min-h-0 w-full min-w-0 flex-col', className)}>
      <div
        className="grid border-b-[1.5px] border-line pb-3 eyebrow"
        style={{ gridTemplateColumns: template }}
      >
        {columns.map((column) => (
          <div key={column.id} className={column.align === 'right' ? 'text-right' : undefined}>
            {column.header}
          </div>
        ))}
      </div>

      <div className="min-h-0 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-body text-muted">{empty ?? 'Nada por aqui ainda.'}</div>
        ) : (
          rows.map((row) => {
            const content = columns.map((column) => (
              <div key={column.id} className={column.align === 'right' ? 'text-right' : undefined}>
                {column.render(row)}
              </div>
            ));

            return onRowClick ? (
              <button
                key={getRowKey(row)}
                type="button"
                onClick={() => onRowClick(row)}
                style={{ gridTemplateColumns: template }}
                className="grid w-full cursor-pointer items-center border-b border-line-soft py-3.5 text-left transition-colors hover:bg-surface-2"
              >
                {content}
              </button>
            ) : (
              <div
                key={getRowKey(row)}
                style={{ gridTemplateColumns: template }}
                className="grid items-center border-b border-line-soft py-3.5"
              >
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
