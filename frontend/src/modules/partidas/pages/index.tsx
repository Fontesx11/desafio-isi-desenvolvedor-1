import { Link } from '@tanstack/react-router';
import { ChevronRight, Plus, Swords } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { MatchScoreCard } from '../components/match-score-card';
import { MatchesTable } from '../components/matches-table';
import { NewMatchDialog } from '../components/new-match-dialog';
import { useMatchesQueries } from '../hooks/useMatchesQueries';

export default function MatchesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { useGetMatches } = useMatchesQueries();
  const { data: matches = [] } = useGetMatches();
  const lastMatch = matches[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Swords}
        title="Partidas"
        subtitle="Jogue partidas entre clubes com os 5 titulares escalados e acompanhe o histórico."
        actions={
          <Button
            type="button"
            className="h-10 gap-2 px-4"
            onClick={() => setIsCreating(true)}
          >
            <Plus />
            Nova partida
          </Button>
        }
      />

      {lastMatch && (
        <div className="space-y-2">
          <h2 className="text-sm text-zinc-500">Última partida</h2>
          <MatchScoreCard
            match={lastMatch}
            action={
              <Button asChild variant="outline">
                <Link
                  to="/matches/$matchId"
                  params={{ matchId: String(lastMatch.id) }}
                >
                  Ver duelos
                  <ChevronRight />
                </Link>
              </Button>
            }
          />
        </div>
      )}

      <MatchesTable />

      {isCreating && <NewMatchDialog onClose={() => setIsCreating(false)} />}
    </div>
  );
}
