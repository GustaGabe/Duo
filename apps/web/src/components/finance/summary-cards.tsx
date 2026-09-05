import type { MonthSummary, SpaceMember } from '@duo/shared';

import { Card } from '@/components/ui/card';
import { AmountDisplay } from '@/components/ui/money';
import { Progress, SplitBar } from '@/components/ui/progress';
import { cn } from '@/lib/cn';
import { formatBRL, formatBRLCompact, formatMonthName } from '@/lib/format';
import { ownerBar, ownerDot } from '@/lib/owner';

export function BalanceHero({ summary }: { summary: MonthSummary }) {
  return (
    <div>
      <p className="text-sm text-muted">Saldo do casal · {formatMonthName(summary.month)}</p>
      <AmountDisplay cents={summary.balanceCents} className="mt-0.5" />
    </div>
  );
}

export function BalanceCard({ summary }: { summary: MonthSummary }) {
  return (
    <Card tone="accent" className="flex flex-col justify-center">
      <p className="text-label text-on-accent/78">Saldo do casal</p>
      <AmountDisplay cents={summary.balanceCents} size="money" tone="on-accent" className="mt-1" />
      <div className="mt-4.5 flex gap-6">
        <div>
          <p className="text-caption text-on-accent/75">Entradas</p>
          <p className="tabular text-section">{formatBRLCompact(summary.incomeCents)}</p>
        </div>
        <div>
          <p className="text-caption text-on-accent/75">Saídas</p>
          <p className="tabular text-section">{formatBRL(summary.expenseCents)}</p>
        </div>
      </div>
    </Card>
  );
}

export function InOutCard({ summary, className }: { summary: MonthSummary; className?: string }) {
  return (
    <Card tone="accent" className={cn('flex', className)}>
      <div className="flex-1">
        <p className="text-label text-on-accent/78">Entradas</p>
        <p className="tabular text-stat">{formatBRLCompact(summary.incomeCents)}</p>
      </div>
      <div className="mx-4.5 w-px bg-on-accent/30" />
      <div className="flex-1">
        <p className="text-label text-on-accent/78">Saídas</p>
        <p className="tabular text-stat">{formatBRL(summary.expenseCents)}</p>
      </div>
    </Card>
  );
}

export function WhoSpent({ summary, members }: { summary: MonthSummary; members: SpaceMember[] }) {
  const first = summary.perPerson.find((person) => person.userId === members[0]?.id);
  const share = Math.round(first?.sharePercent ?? 50);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-body font-semibold text-ink">Quem gastou</h2>
        <p className="font-mono text-micro tracking-[0.08em] text-muted">
          DIVISÃO {share} / {100 - share}
        </p>
      </div>
      <SplitBar sharePercent={share} label={`Divisão ${share} por ${100 - share}`} />
      <div className="mt-3 flex gap-3">
        {members.map((member) => {
          const person = summary.perPerson.find((entry) => entry.userId === member.id);
          return (
            <Card key={member.id} className="flex-1 p-3.5">
              <div className="flex items-center gap-2">
                <span className={cn('size-2 rounded-pill', ownerDot[member.slot])} />
                <span className="text-label text-ink-soft">{member.name.split(' ')[0]}</span>
              </div>
              <p className="tabular mt-1.5 text-amount text-ink">
                {formatBRL(person?.spentCents ?? 0)}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function PersonSpendCard({
  member,
  summary,
}: {
  member: SpaceMember;
  summary: MonthSummary;
}) {
  const person = summary.perPerson.find((entry) => entry.userId === member.id);
  const share = Math.round(person?.sharePercent ?? 0);

  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className={cn('size-2 rounded-pill', ownerDot[member.slot])} />
        <p className="text-label text-muted">Gastos de {member.name.split(' ')[0]}</p>
      </div>
      <p className="tabular mt-2 text-heading text-ink">{formatBRL(person?.spentCents ?? 0)}</p>
      <p className="mt-1 text-label text-muted">
        {share}% do total · {person?.transactionCount ?? 0} lançamentos
      </p>
      <Progress
        value={share}
        label={`Participação de ${member.name}`}
        barClassName={ownerBar[member.slot]}
        className="mt-4"
      />
    </Card>
  );
}
