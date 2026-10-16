import { createFileRoute } from '@tanstack/react-router';
import { findClubDetails } from '@/modules/clubes/mocks/clubs.mock';
import ClubDetailsPage from '@/modules/clubes/pages/club-details';

export const Route = createFileRoute('/_app/clubs/$clubId')({
  // simulacao
  loader: ({ params }) => {
    const club = findClubDetails(Number(params.clubId));
    // A trilha termina no nome do clube, que só se sabe depois de buscá-lo
    return { club, breadcrumb: ['Mercado', 'Clubes', club.name] };
  },
  component: ClubDetailsPage,
});
