import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { loadSession } from '@/hooks/use-session';

const ALWAYS_PUBLIC = new Set(['/', '/invite']);

export const Route = createFileRoute('/_public')({
  beforeLoad: async ({ context, location }) => {
    if (ALWAYS_PUBLIC.has(location.pathname)) return;

    const session = await loadSession(context.queryClient);

    if (session) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-dvh bg-surface">
      <Outlet />
    </div>
  );
}
