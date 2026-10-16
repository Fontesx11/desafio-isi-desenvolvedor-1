import { createFileRoute } from '@tanstack/react-router';
import StandingsPage from '@/modules/classificacao/pages';

export const Route = createFileRoute('/_app/standings/')({
  component: StandingsPage,
  staticData: { breadcrumb: ['Liga', 'Classificação'] },
});
