import type { TransactionKind } from '@duo/shared';

import { formatAmount, formatSigned } from '@/lib/format';
import { tv, type VariantProps } from '@/lib/tv';

export const money = tv({
  base: 'tabular font-semibold',
  variants: {
    kind: { expense: 'text-ink', income: 'text-positive' },
  },
  defaultVariants: { kind: 'expense' },
});

export interface MoneyProps extends VariantProps<typeof money> {
  cents: number;
  kind?: TransactionKind;
  className?: string;
}

export function Money({ cents, kind = 'expense', className }: MoneyProps) {
  return <span className={money({ kind, className })}>{formatSigned(cents, kind)}</span>;
}

export const amountDisplay = tv({
  slots: {
    root: 'flex items-baseline gap-2',
    symbol: 'font-medium',
    value: 'tabular',
  },
  variants: {
    size: {
      display: { symbol: 'text-heading', value: 'text-display' },
      money: { symbol: 'text-title', value: 'text-money' },
      hero: { symbol: 'text-title', value: 'text-hero' },
    },
    tone: {
      ink: { symbol: 'text-subtle', value: 'text-ink' },
      'on-accent': { symbol: 'text-on-accent/60', value: 'text-on-accent' },
    },
    align: {
      left: { root: '' },
      center: { root: 'justify-center' },
    },
  },
  defaultVariants: { size: 'display', tone: 'ink', align: 'left' },
});

export interface AmountDisplayProps extends VariantProps<typeof amountDisplay> {
  cents: number;
  className?: string;
}

export function AmountDisplay({ cents, size, tone, align, className }: AmountDisplayProps) {
  const styles = amountDisplay({ size, tone, align });
  return (
    <p className={styles.root({ class: className })}>
      <span className={styles.symbol()}>R$</span>
      <span className={styles.value()}>{formatAmount(cents)}</span>
    </p>
  );
}
