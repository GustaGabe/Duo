import { Link, createFileRoute } from '@tanstack/react-router';

import { button } from '@/components/ui/button';

export const Route = createFileRoute('/_public/')({ component: OnboardingPage });

function OnboardingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-accent px-8 pt-10 pb-11 lg:px-16 lg:pb-16">
      <Blobs />

      <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
        <h1 className="text-hero text-on-accent text-balance">
          O dinheiro
          <br />
          de vocês dois,
          <br />
          no mesmo lugar.
        </h1>
        <p className="mt-4 max-w-xs text-body leading-relaxed text-on-accent/82">
          Entradas, saídas e quem gastou o quê — sem planilha e sem discussão no fim do mês.
        </p>

        <div className="my-7 flex gap-1.75">
          <span className="h-1.5 w-5.5 rounded-pill bg-on-accent" />
          <span className="h-1.5 w-1.5 rounded-pill bg-on-accent/45" />
          <span className="h-1.5 w-1.5 rounded-pill bg-on-accent/45" />
        </div>

        <Link to="/signup" className={button({ variant: 'contrast', size: 'lg', block: true })}>
          Começar
        </Link>

        <p className="mt-4.5 text-center text-label text-on-accent/80">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-on-accent underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

function Blobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-invert">
      <span className="absolute -top-20 -right-15 size-[330px] bg-current [border-radius:60%_40%_55%_45%/55%_60%_40%_45%]" />
      <span className="absolute top-30 -left-22 h-80 w-75 bg-current [border-radius:45%_55%_40%_60%/60%_45%_55%_40%]" />
      <span className="absolute -top-7 left-0 size-22 rounded-pill bg-surface" />
      <span className="absolute top-82 right-16 grid size-19.5 place-items-center rounded-pill bg-current">
        <span className="size-6 rounded-pill bg-accent" />
      </span>
      <span className="absolute top-100 left-16 size-21 rounded-pill border-2 border-current" />
    </div>
  );
}
