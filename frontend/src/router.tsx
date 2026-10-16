import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  // Trilha do cabeçalho do layout, definida em cada rota
  interface StaticDataRouteOption {
    breadcrumb?: string[];
  }
}

export default function Router() {
  return <RouterProvider router={router} />;
}
