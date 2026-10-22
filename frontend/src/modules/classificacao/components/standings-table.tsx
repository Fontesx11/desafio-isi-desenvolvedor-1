import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { ErrorState } from '@/components/error-state';
import { formatSignedInteger } from '@/lib/format';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import { useStandingsQueries } from '../hooks/useStandingsQueries';
import type { Standing } from '../types/standings.types';

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
    cell: (standing) => <StandingClubCell standing={standing} />,
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

export function StandingsTable() {
  const { useGetStandings } = useStandingsQueries();
  const {
    data: standings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStandings();

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      {isError && (
        <ErrorState
          title="Não foi possível carregar a classificação"
          error={error}
          className="rounded-none border-0"
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <DataTable
          columns={columns}
          rows={standings}
          getRowKey={(standing) => standing.club_id}
          emptyMessage="Nenhum clube cadastrado."
          isLoading={isLoading}
        />
      )}
      <p className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500">
        J: jogos · V: vitórias · E: empates · D: derrotas · GP: gols marcados ·
        GC: gols sofridos · SG: saldo de gols · Pts: pontos
      </p>
    </section>
  );
}

function StandingClubCell({ standing }: { standing: Standing }) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs } = useGetClubs();
  const club = clubs?.find((item) => item.id === standing.club_id);

  return (
    <span className="flex items-center gap-2">
      <span className="w-10 text-xs font-medium text-zinc-600">
        {club?.acronym}
      </span>
      <Link
        to="/clubs/$clubId"
        params={{ clubId: String(standing.club_id) }}
        className="underline underline-offset-2"
      >
        {standing.club_name}
      </Link>
    </span>
  );
}
