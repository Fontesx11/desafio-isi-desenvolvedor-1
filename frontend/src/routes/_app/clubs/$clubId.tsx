import { createFileRoute } from '@tanstack/react-router';
import ClubDetailsPage from '@/modules/clubes/pages/club-details';

export const Route = createFileRoute('/_app/clubs/$clubId')({
  component: ClubDetailsPage,
  staticData: { breadcrumb: ['Clubes'] },
});
