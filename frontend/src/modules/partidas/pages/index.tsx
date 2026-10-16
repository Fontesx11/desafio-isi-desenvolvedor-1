import { Plus, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { MatchScoreCard } from '../components/match-score-card';
import { MatchesTable } from '../components/matches-table';
import { MATCHES_MOCK } from '../mocks/matches.mock';

export default function MatchesPage() {
  // A lista vem da mais recente para a mais antiga: a primeira é a última jogada
  const lastMatch = MATCHES_MOCK[0];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Swords}
        title="Partidas"
        subtitle="Jogue partidas entre clubes com os 5 titulares escalados e acompanhe o histórico."
        actions={
          // simulacao: sem ação até o modal Nova partida
          <Button type="button" className="h-10 gap-2 px-4">
            <Plus />
            Nova partida
          </Button>
        }
      />

      {lastMatch && (
        <div className="space-y-2">
          <h2 className="text-sm text-zinc-500">Última partida</h2>
          <MatchScoreCard match={lastMatch} />
        </div>
      )}

      <MatchesTable matches={MATCHES_MOCK} />
    </div>
  );
}
