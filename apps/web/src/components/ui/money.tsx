import type { TransactionKind } from '@duo/shared';

import { cn } from '@/lib/cn';
import { formatAmount, formatSigned } from '@/lib/format';

export interface MoneyProps {
  cents: number;
  kind?: TransactionKind;
  className?: string;
}

/** Signed value in the entry list. Income uses the theme's positive colour. */
export function Money({ cents, kind = 'expense', className }: MoneyProps) {
  return (
    <span className={cn('tabular font-semibold', kind === 'income' ? 'text-positive' : 'text-ink', className)}>
      {formatSigned(cents, kind)}
    </span>
  );
}

export interface AmountDisplayProps {
  cents: number;
  /** `hero` is the huge figure on entry screens; `display` is the dashboard balance. */
  size?: 'hero' | 'display' | 'money';
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Large figure with a lighter "R$" beside it — the treatment the design uses for the couple's
 * balance and for the numeric keypad.
 */
export function AmountDisplay({ cents, size = 'display', align = 'left', className }: AmountDisplayProps) {
  const symbolSize = size === 'display' ? 'text-heading' : 'text-title';
  const valueSize = size === 'hero' ? 'text-hero' : size === 'money' ? 'text-money' : 'text-display';

  return (
    <p
      className={cn(
        'flex items-baseline gap-2',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      <span className={cn('font-medium text-subtle', symbolSize)}>R$</span>
      <span className={cn('tabular text-ink', valueSize)}>{formatAmount(cents)}</span>
    </p>
  );
}
