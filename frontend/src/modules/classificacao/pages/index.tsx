import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { ArrowRight, ListOrdered, Plus } from 'lucide-react';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/layout/components/page-header';
import { formatDate, formatSignedInteger, formatTime } from '@/lib/format';
import { findClub } from '@/modules/jogadores/utils/players.utils';
import { NewMatchDialog } from '@/modules/partidas/components/new-match-dialog';
import { MATCHES_MOCK } from '@/modules/partidas/mocks/matches.mock';
import { STANDINGS_MOCK } from '../mocks/standings.mock';
import type { Standing } from '../types/standings.types';

const ORDER_CRITERIA = [
  'Mais pontos',
  'Maior saldo de gols',
  'Mais gols marcados',
  'Nome do clube, de A a Z',
];

function numberColumn(
  id: string,
  header: string,
  value: (standing: Standing) => string | number,
): DataTableColumn<Standing> {
  return {
    id,
    header,
    className: 'w-14 text-center',
    cell: (standing) => (
      <span className={cn(standing.played === 0 && 'text-zinc-400')}>
        {value(standing)}
      </span>
    ),
  };
}

const columns: DataTableColumn<Standing>[] = [
  {
    id: 'position',
    header: '#',
    className: 'w-14 text-center',
    cell: (standing) => (
      <span
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-md bg-zinc-100 text-sm',
          standing.position === 1 && 'bg-primary text-primary-foreground',
        )}
      >
        {standing.position}
      </span>
    ),
  },
  {
    id: 'club',
    header: 'Clube',
    cell: (standing) => (
      <span className="flex items-center gap-2">
        <span className="w-10 text-xs font-medium text-zinc-600">
          {findClub(standing.club_id)?.acronym}
        </span>
        <Link
          to="/clubs/$clubId"
          params={{ clubId: String(standing.club_id) }}
          className="underline underline-offset-2"
        >
          {standing.club_name}
        </Link>
      </span>
    ),
  },
  numberColumn('played', 'J', (standing) => standing.played),
  numberColumn('wins', 'V', (standing) => standing.wins),
  numberColumn('draws', 'E', (standing) => standing.draws),
  numberColumn('losses', 'D', (standing) => standing.losses),
  numberColumn('goals-for', 'GP', (standing) => standing.goals_for),
  numberColumn('goals-against', 'GC', (standing) => standing.goals_against),
  numberColumn('goal-difference', 'SG', (standing) =>
    formatSignedInteger(standing.goal_difference),
  ),
  {
    id: 'points',
    header: 'Pts',
    className: 'w-14 text-center',
    cell: (standing) => (
      <span className="font-semibold">{standing.points}</span>
    ),
  },
];

export default function StandingsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const recentMatches = MATCHES_MOCK.slice(0, 2);

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
        <section className="overflow-hidden rounded-xl border border-zinc-200">
          <DataTable
            columns={columns}
            rows={STANDINGS_MOCK}
            getRowKey={(standing) => standing.club_id}
            emptyMessage="Nenhum clube cadastrado."
          />
          <p className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
            J: jogos · V: vitórias · E: empates · D: derrotas · GP: gols
            marcados · GC: gols sofridos · SG: saldo de gols · Pts: pontos
          </p>
        </section>

        <aside className="space-y-4">
          <section className="overflow-hidden rounded-xl border border-zinc-200">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Últimas partidas</h2>
              <p className="text-sm text-zinc-500">
                Da mais recente para a mais antiga.
              </p>
            </div>
            <ul className="space-y-3 p-4">
              {recentMatches.map((match) => (
                <li key={match.id} className="space-y-1">
                  <p className="text-xs text-zinc-500">
                    {formatDate(match.played_at)}, {formatTime(match.played_at)}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span
                      className={cn(
                        match.result === 'MANDANTE' && 'font-semibold',
                      )}
                    >
                      {match.home.club_name}
                    </span>
                    <span className="rounded bg-zinc-100 px-1.5 font-semibold tabular-nums">
                      {match.home.goals} × {match.away.goals}
                    </span>
                    <span
                      className={cn(
                        match.result === 'VISITANTE' && 'font-semibold',
                      )}
                    >
                      {match.away.club_name}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="px-4 pb-4">
              <Button asChild variant="link" className="h-auto p-0">
                <Link to="/matches">
                  Ver todas as partidas
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </section>

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
