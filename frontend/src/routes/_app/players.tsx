import { createFileRoute } from '@tanstack/react-router';
import PlayersPage from '@/modules/jogadores/pages';

export const Route = createFileRoute('/_app/players')({
  component: PlayersPage,
  staticData: { breadcrumb: ['Mercado', 'Jogadores'] },
});
