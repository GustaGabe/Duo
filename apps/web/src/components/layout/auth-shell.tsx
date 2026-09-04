import type { ReactNode } from 'react';

import { Logo } from './logo';

export function AuthShell({
  children,
  showcase = false,
}: {
  children: ReactNode;
  showcase?: boolean;
}) {
  return (
    <div className="flex min-h-dvh">
      {showcase ? <Showcase /> : null}
      <div className="flex flex-1 items-center justify-center px-7 py-14">
        <div className="w-full max-w-100">
          <Logo />
          {children}
        </div>
      </div>
    </div>
  );
}

function Showcase() {
  return (
    <div className="relative hidden w-155 shrink-0 flex-col justify-end overflow-hidden bg-accent p-14 lg:flex">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-invert">
        <span className="absolute -top-25 -right-20 h-85 w-95 bg-current [border-radius:60%_40%_55%_45%/55%_60%_40%_45%]" />
        <span className="absolute top-45 -left-30 h-90 w-85 bg-current [border-radius:45%_55%_40%_60%/60%_45%_55%_40%]" />
        <span className="absolute top-75 right-30 grid size-23 place-items-center rounded-pill bg-current">
          <span className="size-7 rounded-pill bg-accent" />
        </span>
      </div>
      <div className="relative">
        <h2 className="text-hero leading-[1.05] text-on-accent">
          O dinheiro de
          <br />
          vocês dois, no
          <br />
          mesmo lugar.
        </h2>
        <p className="mt-4.5 max-w-95 text-base leading-relaxed text-on-accent/82">
          Cada lançamento com o nome de quem gastou. Um painel só, sem planilha.
        </p>
      </div>
    </div>
  );
}
