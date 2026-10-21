import { Link } from '@tanstack/react-router';
import { cn } from 'cn';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/lib/format';
import { useMatchesQueries } from '@/modules/partidas/hooks/useMatchesQueries';

export function RecentMatchesCard() {
  const { useGetMatches } = useMatchesQueries();
  const { data: matches = [], isSuccess } = useGetMatches();
  const recentMatches = matches.slice(0, 2);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="font-semibold">Últimas partidas</h2>
        <p className="text-sm text-zinc-500">
          Da mais recente para a mais antiga.
        </p>
      </div>
      <ul className="space-y-3 p-4">
        {isSuccess && recentMatches.length === 0 && (
          <li className="text-sm text-zinc-500">Nenhuma partida jogada.</li>
        )}
        {recentMatches.map((match) => (
          <li key={match.id} className="space-y-1">
            <p className="text-xs text-zinc-500">
              {formatDate(match.played_at)}, {formatTime(match.played_at)}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <span
                className={cn(match.result === 'MANDANTE' && 'font-semibold')}
              >
                {match.home.club_name}
              </span>
              <span className="rounded bg-zinc-100 px-1.5 font-semibold tabular-nums">
                {match.home.goals} × {match.away.goals}
              </span>
              <span
                className={cn(match.result === 'VISITANTE' && 'font-semibold')}
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
  );
}
