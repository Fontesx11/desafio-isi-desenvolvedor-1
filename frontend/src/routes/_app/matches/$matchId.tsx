import { createFileRoute } from '@tanstack/react-router';
import MatchDetailsPage from '@/modules/partidas/pages/match-details';

export const Route = createFileRoute('/_app/matches/$matchId')({
  component: MatchDetailsPage,
  staticData: { breadcrumb: ['Liga', 'Partidas'] },
});
