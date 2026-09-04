import { createFileRoute } from '@tanstack/react-router';

import { InvitePanel } from '@/components/finance/invite-panel';
import { PageHeader, ThemeToggle } from '@/components/layout/page-header';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/misc';
import { useCouple } from '@/hooks/use-couple';
import { useMonthSummary } from '@/hooks/use-summary';
import { formatBRL } from '@/lib/format';

export const Route = createFileRoute('/_app/couple')({ component: CouplePage });

function CouplePage() {
  const { data: couple } = useCouple();
  const { data: summary } = useMonthSummary();

  if (!couple || !summary) return <Skeleton className="h-96" />;

  return (
    <>
      <PageHeader title="Casal" subtitle={`Código ${couple.code}`} actions={<ThemeToggle />} />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {couple.members.map((member) => {
            const person = summary.perPerson.find((entry) => entry.userId === member.id);
            return (
              <Card key={member.id} className="flex items-center gap-4">
                <Avatar name={member.name} slot={member.slot} size="xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-section text-ink">{member.name}</p>
                  <p className="truncate text-caption text-muted">{member.email}</p>
                </div>
                <div className="text-right">
                  <p className="tabular text-amount text-ink">{formatBRL(person?.spentCents ?? 0)}</p>
                  <p className="text-micro text-subtle">{Math.round(person?.sharePercent ?? 0)}% do mês</p>
                </div>
              </Card>
            );
          })}
        </div>

        <InvitePanel couple={couple} />
      </div>
    </>
  );
}
