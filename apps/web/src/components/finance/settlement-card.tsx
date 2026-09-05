import type { MonthSummary, SpaceMember } from '@duo/shared';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatBRL } from '@/lib/format';

export function SettlementCard({
  summary,
  members,
  onSettle,
}: {
  summary: MonthSummary;
  members: SpaceMember[];
  onSettle: () => void;
}) {
  const name = (id: string) => members.find((member) => member.id === id)?.name.split(' ')[0] ?? '—';
  const { settlements } = summary;

  return (
    <Card tone="invert">
      <p className="eyebrow text-on-invert-muted">Acerto do mês</p>

      {settlements.length === 0 ? (
        <p className="mt-2 text-stat">Ninguém deve nada.</p>
      ) : (
        <>
          <ul className="mt-2 flex flex-col gap-2">
            {settlements.map((settlement) => (
              <li key={`${settlement.fromUserId}-${settlement.toUserId}`} className="text-stat">
                {name(settlement.fromUserId)} deve {formatBRL(settlement.amountCents)} para{' '}
                {name(settlement.toUserId)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-label text-on-invert/70">
            Considerando as despesas marcadas como divididas.
          </p>
          <Button variant="action" size="sm" block className="mt-4" onClick={onSettle}>
            Marcar como acertado
          </Button>
        </>
      )}
    </Card>
  );
}
