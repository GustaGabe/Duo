import type { Category, SpaceMember, Transaction } from '@duo/shared';

import { Money } from '@/components/ui/money';
import { TagSquare } from '@/components/ui/tag-square';
import { cn } from '@/lib/cn';
import { formatRelativeDay } from '@/lib/format';
import { ownerDot } from '@/lib/owner';

export interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  payer?: SpaceMember;
  today: string;
  onClick?: () => void;
  className?: string;
}

export function TransactionItem({
  transaction,
  category,
  payer,
  today,
  onClick,
  className,
}: TransactionItemProps) {
  const meta = [payer?.name.split(' ')[0], formatRelativeDay(transaction.date, today)]
    .filter(Boolean)
    .join(' · ');

  const content = (
    <>
      <TagSquare tag={category?.tag ?? '??'} color={category?.color} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-medium text-ink">{transaction.description}</span>
        <span className="mt-0.5 flex items-center gap-1.5">
          {payer ? <span className={cn('size-1.5 rounded-pill', ownerDot[payer.slot])} /> : null}
          <span className="text-caption text-muted">{meta}</span>
        </span>
      </span>
      <Money cents={transaction.amountCents} kind={transaction.kind} />
    </>
  );

  const base = 'flex w-full items-center gap-3.5 py-2.5 text-left';

  return onClick ? (
    <button type="button" onClick={onClick} className={cn(base, 'cursor-pointer', className)}>
      {content}
    </button>
  ) : (
    <div className={cn(base, className)}>{content}</div>
  );
}
