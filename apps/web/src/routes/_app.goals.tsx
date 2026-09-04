import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/misc';

export const Route = createFileRoute('/_app/goals')({ component: GoalsPage });

function GoalsPage() {
  return (
    <>
      <PageHeader title="Metas" subtitle="Objetivos de curto e longo prazo do casal" />
      <Card>
        <EmptyState
          title="Nenhuma meta ainda"
          description="Guardar para uma viagem, uma reserva de emergência ou a entrada de um imóvel — em breve por aqui."
          action={<Button className="mt-2">Criar primeira meta</Button>}
        />
      </Card>
    </>
  );
}
