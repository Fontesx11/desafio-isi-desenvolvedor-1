import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { Player } from '../types/players.types';
import { PlayerSummaryCard } from './player-summary-card';
import { usePlayersQueries } from '../hooks/usePlayersQueries';

type DeletePlayerDialogProps = {
  player: Player;
  onClose: () => void;
};

export function DeletePlayerDialog({
  player,
  onClose,
}: DeletePlayerDialogProps) {
  const { useDeletePlayer } = usePlayersQueries();
  const { mutate, isPending } = useDeletePlayer();
  const isSending = useRef(false);

  function handleConfirm() {
    if (isSending.current) return;
    isSending.current = true;
    mutate(player.id, {
      onSuccess: () => {
        toast.success('Jogador excluído', {
          description: `${player.name} saiu da lista. Transações e partidas antigas dele continuam gravadas.`,
        });
        onClose();
      },
      onSettled: () => {
        isSending.current = false;
      },
    });
  }

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="gap-5 p-8 data-[size=default]:sm:max-w-[480px]">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-xl">
            Excluir {player.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            O jogador sai da lista e da busca, mas as transações e as partidas
            antigas dele continuam como foram gravadas.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <PlayerSummaryCard
          player={player}
          aside={<Badge variant="secondary">Livre</Badge>}
        />

        <AlertDialogFooter className="mx-0 mb-0 rounded-none bg-transparent px-0 pt-5 pb-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 />
            Excluir jogador
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
