import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { DuelsTable } from '../components/duels-table';
import { MatchScoreCard } from '../components/match-score-card';
import { useMatchesQueries } from '../hooks/useMatchesQueries';

export default function MatchDetailsPage() {
  const { matchId } = useParams({ from: '/_app/matches/$matchId' });
  const { useGetMatch } = useMatchesQueries();
  const { data: match, isError, error, refetch } = useGetMatch(Number(matchId));

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar a partida"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!match) {
    return <LoadingState />;
  }

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
