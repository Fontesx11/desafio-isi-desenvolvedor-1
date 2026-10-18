import { createFileRoute } from '@tanstack/react-router';
import ClubsPage from '@/modules/clubes/pages';

export const Route = createFileRoute('/_app/clubs/')({
  component: ClubsPage,
  staticData: { breadcrumb: ['Clubes'] },
});
