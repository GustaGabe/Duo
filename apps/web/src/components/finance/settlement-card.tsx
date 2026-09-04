import type { MonthSummary, User } from '@duo/shared';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatBRL } from '@/lib/format';

export function SettlementCard({
  summary,
  members,
  onSettle,
}: {
  summary: MonthSummary;
  members: User[];
  onSettle: () => void;
}) {
  const { settlement } = summary;

  const name = (id: string) => members.find((member) => member.id === id)?.name.split(' ')[0] ?? '—';

  return (
    <Card tone="invert">
      <p className="eyebrow text-on-invert-muted">Acerto do mês</p>
      {settlement ? (
        <>
          <p className="mt-2 text-stat">
            {name(settlement.fromUserId)} deve {formatBRL(settlement.amountCents)} para{' '}
            {name(settlement.toUserId)}
          </p>
          <p className="mt-1.5 text-label text-on-invert/70">
            Considerando as despesas marcadas como divididas 50/50.
          </p>
          <Button variant="action" size="sm" block className="mt-4" onClick={onSettle}>
            Marcar como acertado
          </Button>
        </>
      ) : (
        <p className="mt-2 text-stat">Ninguém deve nada.</p>
      )}
    </Card>
  );
}
