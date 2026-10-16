import {
  Ellipsis,
  Eye,
  HeartPulse,
  Pencil,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Player, PlayerAction } from '../types/players.types';
import { isFreePlayer } from '../utils/players.utils';

type PlayerRowActionsProps = {
  player: Player;
  onAction: (action: PlayerAction, player: Player) => void;
};

export function PlayerRowActions({ player, onAction }: PlayerRowActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Ações de ${player.name}`}
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal text-zinc-500">
          {player.name}
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onAction('details', player)}>
          <Eye />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction('edit', player)}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction('condition', player)}>
          <HeartPulse />
          Alterar condição
        </DropdownMenuItem>
        {isFreePlayer(player) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onAction('buy', player)}>
              <ShoppingCart />
              Comprar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onAction('delete', player)}
            >
              <Trash2 />
              Excluir
            </DropdownMenuItem>
            <p className="px-1.5 pb-1 text-xs text-zinc-500">
              Disponível porque o jogador está livre.
            </p>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
