import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({ component: PublicLayout });

function PublicLayout() {
  return (
    <div className="min-h-dvh bg-surface">
      <Outlet />
    </div>
  );
}
