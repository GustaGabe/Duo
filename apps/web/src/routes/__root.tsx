import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-8 text-center">
      <div>
        <p className="eyebrow">erro 404</p>
        <h1 className="mt-2 text-title">Essa página não existe.</h1>
        <a className="mt-6 inline-block font-semibold text-accent" href="/dashboard">
          Voltar para o painel
        </a>
      </div>
    </div>
  );
}
