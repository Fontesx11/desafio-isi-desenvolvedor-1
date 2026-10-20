import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, ServerOff } from 'lucide-react';
import { ListState } from '@/components/list-state';
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
      <ListState
        icon={ServerOff}
        title="Não foi possível carregar a partida"
        description={error.message}
        action={
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw />
            Tentar de novo
          </Button>
        }
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
