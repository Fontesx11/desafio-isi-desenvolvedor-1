import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { ChevronRight, Shield } from 'lucide-react';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, formatTime } from '@/lib/format';
import { CLUBS_MOCK } from '@/modules/clubes/mocks/clubs.mock';
import { findClub } from '@/modules/jogadores/utils/players.utils';
import { RESULT_LABELS } from '../constants/matches.constants';
import type { Match } from '../types/matches.types';

const columns: DataTableColumn<Match>[] = [
  {
    id: 'played-at',
    header: 'Data e hora',
    cell: (match) => (
      <span>
        {formatDate(match.played_at)}{' '}
        <span className="text-zinc-500">{formatTime(match.played_at)}</span>
      </span>
    ),
  },
  {
    id: 'home',
    header: 'Mandante',
    className: 'text-right',
    cell: (match) => (
      <span className="inline-flex items-center gap-2">
        <span className={cn(match.result === 'MANDANTE' && 'font-semibold')}>
          {match.home.club_name}
        </span>
        <Badge variant="secondary">
          {findClub(match.home.club_id)?.acronym}
        </Badge>
      </span>
    ),
  },
  {
    id: 'score',
    header: 'Placar',
    className: 'text-center',
    cell: (match) => (
      <Badge variant="secondary" className="font-semibold tabular-nums">
        {match.home.goals} × {match.away.goals}
      </Badge>
    ),
  },
  {
    id: 'away',
    header: 'Visitante',
    cell: (match) => (
      <span className="inline-flex items-center gap-2">
        <Badge variant="secondary">
          {findClub(match.away.club_id)?.acronym}
        </Badge>
        <span className={cn(match.result === 'VISITANTE' && 'font-semibold')}>
          {match.away.club_name}
        </span>
      </span>
    ),
  },
  {
    id: 'result',
    header: 'Resultado',
    cell: (match) => (
      <Badge variant="outline">{RESULT_LABELS[match.result]}</Badge>
    ),
  },
  {
    id: 'actions',
    header: <span className="sr-only">Ações</span>,
    className: 'w-0',
    cell: (match) => (
      <Button asChild variant="ghost" size="sm">
        <Link to="/matches/$matchId" params={{ matchId: String(match.id) }}>
          Ver duelos
          <ChevronRight />
        </Link>
      </Button>
    ),
  },
];

export function MatchesTable({ matches }: { matches: Match[] }) {
  // simulacao
  const [clubId, setClubId] = useState('all');

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h2 className="font-semibold">Histórico de partidas</h2>
          <p className="text-sm text-zinc-500">
            Da mais recente para a mais antiga.
          </p>
        </div>
        <Select value={clubId} onValueChange={setClubId}>
          <SelectTrigger
            aria-label="Filtrar por clube"
            className="w-56 justify-start [&>svg:last-child]:ml-auto"
          >
            <Shield className="text-zinc-400" />
            <span className="text-zinc-500">Clube:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">todos</SelectItem>
            {CLUBS_MOCK.map((club) => (
              <SelectItem key={club.id} value={String(club.id)}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        rows={matches}
        getRowKey={(match) => match.id}
        emptyMessage="Nenhuma partida jogada."
      />
    </section>
  );
}
