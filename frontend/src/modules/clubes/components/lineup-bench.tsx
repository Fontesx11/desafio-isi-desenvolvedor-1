import { ConditionBadge } from '@/modules/jogadores/components/condition-badge';
import { PlayerAvatar } from '@/modules/jogadores/components/player-avatar';
import { POSITION_LABELS } from '@/modules/jogadores/constants/players.constants';
import type { SquadPlayer } from '../types/clubs.types';

export function LineupBench({ players }: { players: SquadPlayer[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="font-semibold">Reservas</h2>
        <p className="text-sm text-zinc-500">
          Jogadores do elenco fora da escalação.
        </p>
      </div>
      <ul className="divide-y divide-zinc-200">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-3 p-4">
            <PlayerAvatar player={player} />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate font-medium">{player.name}</p>
              <p className="text-xs text-zinc-500">
                {POSITION_LABELS[player.position]}
              </p>
            </div>
            <ConditionBadge condition={player.condition} />
          </li>
        ))}
      </ul>
    </section>
  );
}
