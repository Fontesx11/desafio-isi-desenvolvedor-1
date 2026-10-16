import { createFileRoute } from '@tanstack/react-router';
import MatchesPage from '@/modules/partidas/pages';

export const Route = createFileRoute('/_app/matches/')({
  component: MatchesPage,
  staticData: { breadcrumb: ['Liga', 'Partidas'] },
});
