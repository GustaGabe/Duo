import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/cn';
import { currentMonth } from '@/lib/clock';
import { formatMonthLong } from '@/lib/format';
import { useSelectedMonthStore } from '@/lib/selected-month';

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function MonthPicker() {
  const month = useSelectedMonthStore((state) => state.month);
  const setMonth = useSelectedMonthStore((state) => state.setMonth);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => Number(month.slice(0, 4)));

  const now = currentMonth();
  const isCurrent = month === now;

  return (
    <>
      <button
        type="button"
        aria-label={`Mês: ${formatMonthLong(month)}. Trocar de mês.`}
        title={formatMonthLong(month)}
        onClick={() => {
          setYear(Number(month.slice(0, 4)));
          setOpen(true);
        }}
        className={cn(
          'grid size-11 shrink-0 cursor-pointer place-items-center rounded-field border-[1.5px] transition-colors',
          isCurrent
            ? 'border-line bg-surface text-ink hover:bg-surface-2'
            : 'border-accent bg-accent text-on-accent hover:bg-accent-strong',
        )}
      >
        <svg viewBox="0 0 20 20" className="size-4.5" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="2.75" y="4.25" width="14.5" height="13" rx="2.5" />
            <path d="M2.75 8.25h14.5M6.75 2.75v3M13.25 2.75v3" />
          </g>
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Escolher mês" size="sm">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Ano anterior"
              onClick={() => setYear((value) => value - 1)}
              className="grid size-10 cursor-pointer place-items-center rounded-control border-[1.5px] border-line text-ink transition-colors hover:bg-surface-2"
            >
              ‹
            </button>
            <p className="tabular text-section text-ink">{year}</p>
            <button
              type="button"
              aria-label="Próximo ano"
              onClick={() => setYear((value) => value + 1)}
              className="grid size-10 cursor-pointer place-items-center rounded-control border-[1.5px] border-line text-ink transition-colors hover:bg-surface-2"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((label, index) => {
              const value = `${year}-${String(index + 1).padStart(2, '0')}`;
              const selected = value === month;

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setMonth(value);
                    setOpen(false);
                  }}
                  className={cn(
                    'h-11 cursor-pointer rounded-control border-[1.5px] text-label font-medium capitalize transition-colors',
                    selected
                      ? 'border-accent bg-accent text-on-accent'
                      : value === now
                        ? 'border-ink text-ink hover:bg-surface-2'
                        : 'border-line text-ink-soft hover:bg-surface-2',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {!isCurrent ? (
            <Button
              variant="secondary"
              block
              onClick={() => {
                setMonth(now);
                setOpen(false);
              }}
            >
              Voltar para o mês atual
            </Button>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
