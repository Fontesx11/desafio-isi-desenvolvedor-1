import { Link, useLoaderData } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DuelsTable } from '../components/duels-table';
import { MatchScoreCard } from '../components/match-score-card';

export default function MatchDetailsPage() {
  const { match } = useLoaderData({ from: '/_app/matches/$matchId' });

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3">
        <Link to="/matches">
          <ArrowLeft />
          Voltar para partidas
        </Link>
      </Button>
      <MatchScoreCard match={match} showFormations />
      <DuelsTable match={match} />
    </div>
  );
}
