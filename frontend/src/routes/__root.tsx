import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster duration={2000} position="top-right" richColors />
    </>
  );
}
