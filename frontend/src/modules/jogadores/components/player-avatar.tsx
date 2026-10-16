import { cn } from 'cn';
import type { Player } from '../types/players.types';
import { getInitials } from '../utils/players.utils';

const COLORS = [
  'bg-zinc-100 text-zinc-600',
  'bg-pink-50 text-pink-600',
  'bg-teal-50 text-teal-700',
  'bg-violet-50 text-violet-600',
  'bg-sky-50 text-sky-700',
];

type PlayerAvatarProps = {
  player: Pick<Player, 'id' | 'name'>;
  className?: string;
};

export function PlayerAvatar({ player, className }: PlayerAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium',
        COLORS[player.id % COLORS.length],
        className,
      )}
    >
      {getInitials(player.name)}
    </span>
  );
}
