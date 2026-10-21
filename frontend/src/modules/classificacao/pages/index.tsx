import { ListOrdered, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { NewMatchDialog } from '@/modules/partidas/components/new-match-dialog';
import { RecentMatchesCard } from '../components/recent-matches-card';
import { StandingsTable } from '../components/standings-table';
import { ORDER_CRITERIA } from '../constants/standings.constants';

export default function StandingsPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListOrdered}
        title="Classificação"
        subtitle="Todos os clubes, com 3 pontos por vitória e 1 por empate."
        actions={
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 px-4"
            onClick={() => setIsCreating(true)}
          >
            <Plus />
            Nova partida
          </Button>
        }
      />

      <div className="grid grid-cols-[1fr_18rem] items-start gap-4">
        <StandingsTable />

        <aside className="space-y-4">
          <RecentMatchesCard />

          <section className="overflow-hidden rounded-xl border border-zinc-200">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Ordem da tabela</h2>
              <p className="text-sm text-zinc-500">
                Critérios de classificação, nesta ordem.
              </p>
            </div>
            <ol className="space-y-2 p-4 text-sm">
              {ORDER_CRITERIA.map((criterion, index) => (
                <li key={criterion} className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-zinc-100 text-xs">
                    {index + 1}
                  </span>
                  {criterion}
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      {isCreating && <NewMatchDialog onClose={() => setIsCreating(false)} />}
    </div>
  );
}
