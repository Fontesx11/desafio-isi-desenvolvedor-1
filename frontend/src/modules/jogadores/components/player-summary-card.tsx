import type { ReactNode } from 'react';
import { POSITION_LABELS } from '../constants/players.constants';
import type { Player } from '../types/players.types';
import { PlayerAvatar } from './player-avatar';

type PlayerSummaryCardProps = {
  player: Player;
  // Selo à direita (condição, "Livre")
  aside: ReactNode;
};

export function PlayerSummaryCard({ player, aside }: PlayerSummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <PlayerAvatar player={player} className="size-10 text-sm" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{player.name}</p>
        <p className="text-sm text-zinc-500">
          {player.position} · {POSITION_LABELS[player.position]} · {player.age}{' '}
          anos
        </p>
      </div>
      {aside}
    </div>
  );
}
