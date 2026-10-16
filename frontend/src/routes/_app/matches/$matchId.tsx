import { createFileRoute } from '@tanstack/react-router';
import { findMatchMock } from '@/modules/partidas/mocks/matches.mock';
import MatchDetailsPage from '@/modules/partidas/pages/match-details';

export const Route = createFileRoute('/_app/matches/$matchId')({
  // simulacao
  loader: ({ params }) => {
    const match = findMatchMock(Number(params.matchId));
    const { home, away } = match;
    return {
      match,
      breadcrumb: [
        'Liga',
        'Partidas',
        `${home.club_name} ${home.goals} × ${away.goals} ${away.club_name}`,
      ],
    };
  },
  component: MatchDetailsPage,
});
