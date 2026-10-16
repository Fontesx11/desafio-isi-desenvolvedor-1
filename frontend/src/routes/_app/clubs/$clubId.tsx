import { createFileRoute } from '@tanstack/react-router';
import { findClubDetails } from '@/modules/clubes/mocks/clubs.mock';
import ClubDetailsPage from '@/modules/clubes/pages/club-details';

export const Route = createFileRoute('/_app/clubs/$clubId')({
  // simulacao
  loader: ({ params }) => {
    const club = findClubDetails(Number(params.clubId));
    return { club, breadcrumb: ['Mercado', 'Clubes', club.name] };
  },
  component: ClubDetailsPage,
});
