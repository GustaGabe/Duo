import type { TransactionKind } from '@duo/shared';

import { cn } from '@/lib/cn';
import { formatAmount, formatSigned } from '@/lib/format';

export interface MoneyProps {
  cents: number;
  kind?: TransactionKind;
  className?: string;
}

export function Money({ cents, kind = 'expense', className }: MoneyProps) {
  return (
    <span className={cn('tabular font-semibold', kind === 'income' ? 'text-positive' : 'text-ink', className)}>
      {formatSigned(cents, kind)}
    </span>
  );
}

export interface AmountDisplayProps {
  cents: number;
  size?: 'hero' | 'display' | 'money';
  align?: 'left' | 'center';
  className?: string;
}

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
