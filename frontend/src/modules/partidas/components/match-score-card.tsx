import { cn } from 'cn';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/lib/format';
import { ClubAcronym } from '@/modules/clubes/components/club-acronym';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import { RESULT_LABELS } from '../constants/matches.constants';
import type { Match, MatchSide } from '../types/matches.types';

type MatchScoreCardProps = {
  match: Match;
  // Mostra a formação de cada clube embaixo do nome (página da partida)
  showFormations?: boolean;
  action?: ReactNode;
};

export function MatchScoreCard({
  match,
  showFormations = false,
  action,
}: MatchScoreCardProps) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs = [] } = useGetClubs();
  const homeClub = clubs.find((club) => club.id === match.home.club_id);
  const awayClub = clubs.find((club) => club.id === match.away.club_id);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-5">
      <div className="flex flex-1 items-center justify-center gap-4">
        <Side
          side={match.home}
          acronym={homeClub?.acronym ?? ''}
          label="Mandante"
          showFormation={showFormations}
          winner={match.result === 'MANDANTE'}
          align="right"
        />
        <div className="flex flex-col items-center gap-1.5">
          <span className="rounded-lg bg-zinc-100 px-4 py-1.5 text-2xl font-semibold tabular-nums">
            {match.home.goals} × {match.away.goals}
          </span>
          <span className="text-xs text-zinc-500">
            {formatDate(match.played_at)}, {formatTime(match.played_at)}
          </span>
          <Badge variant="outline">{RESULT_LABELS[match.result]}</Badge>
        </div>
        <Side
          side={match.away}
          acronym={awayClub?.acronym ?? ''}
          label="Visitante"
          showFormation={showFormations}
          winner={match.result === 'VISITANTE'}
          align="left"
        />
      </div>
      {action}
    </div>
  );
}

function Side({
  side,
  acronym,
  label,
  showFormation,
  winner,
  align,
}: {
  side: MatchSide;
  acronym: string;
  label: string;
  showFormation: boolean;
  winner: boolean;
  align: 'left' | 'right';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        align === 'right' && 'flex-row-reverse text-right',
      )}
    >
      <ClubAcronym acronym={acronym} className="h-12 w-12 rounded-xl" />
      <div>
        <p className={cn('text-lg', winner && 'font-semibold')}>
          {side.club_name}
        </p>
        <p className="text-xs text-zinc-500">
          {label}
          {showFormation && ` · ${side.formation}`}
        </p>
      </div>
    </div>
  );
}
