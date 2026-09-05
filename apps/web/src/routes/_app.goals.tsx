import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';

export const Route = createFileRoute('/_app/goals')({ component: GoalsPage });

const PLANNED = [
  'Definir um objetivo com valor e prazo',
  'Acompanhar o quanto já foi guardado',
  'Puxar aportes direto dos lançamentos',
];

function GoalsPage() {
  return (
    <>
      <PageHeader title="Metas" subtitle="Objetivos de curto e longo prazo do espaço" />

      <Card className="flex flex-col items-center gap-4 py-14 text-center">
        <span className="rounded-pill bg-surface-2 px-3 py-1 font-mono text-micro tracking-[0.14em] text-muted uppercase">
          Em construção
        </span>
        <div>
          <h2 className="text-heading text-ink">Metas ainda não estão prontas</h2>
          <p className="mx-auto mt-2 max-w-md text-body text-muted">
            Esta tela ficou de fora desta etapa. Ela entra quando o design existir — por enquanto os
            lançamentos e o acerto do mês dão conta.
          </p>
        </div>
        <ul className="mt-2 flex flex-col gap-2 text-left">
          {PLANNED.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-label text-ink-soft">
              <span className="size-1.5 shrink-0 rounded-pill bg-line-dashed" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
