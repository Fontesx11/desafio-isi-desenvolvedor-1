import { CircleCheck, Eye } from 'lucide-react';
import { ResultList, type ResultRow } from '@/components/result-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/format';
import { POSITION_LABELS } from '../constants/players.constants';
import type { Player } from '../types/players.types';

type PlayerCreatedDialogProps = {
  player: Player;
  onClose: () => void;
  onShowDetails: () => void;
};

export function PlayerCreatedDialog({
  player,
  onClose,
  onShowDetails,
}: PlayerCreatedDialogProps) {
  const rows: ResultRow[] = [
    {
      label: 'Valor base',
      hint: 'Calculado no cadastro; não muda depois',
      value: formatCurrency(player.base_value),
      highlight: true,
    },
    {
      label: 'Valor de mercado',
      hint: 'Com condição, agilidade e idade',
      value: formatCurrency(player.market_value),
    },
    {
      label: 'Overall',
      hint: `Pelos pesos da posição ${POSITION_LABELS[player.position]}`,
      value: player.overall,
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 p-8 sm:max-w-[540px]">
        <DialogHeader className="gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-green-50 text-green-700">
            <CircleCheck className="size-5" />
          </span>
          <DialogTitle className="text-xl">Jogador cadastrado</DialogTitle>
          <DialogDescription>
            {player.name} entrou livre e Apto. Valores em moedas, calculados
            pela API ao salvar.
          </DialogDescription>
        </DialogHeader>

        <ResultList rows={rows} />

        <DialogFooter className="mx-0 mb-0 rounded-none bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onShowDetails}>
            <Eye />
            Ver detalhes
          </Button>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
