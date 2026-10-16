import { createFileRoute, Outlet } from '@tanstack/react-router';
import AppLayout from '@/layout';

export const Route = createFileRoute('/_app')({
  component: AppLayoutRoute,
});

// Envolve as páginas internas com o menu lateral e o cabeçalho
function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
