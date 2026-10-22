import { Handshake, Info } from 'lucide-react';
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
import {
  formatCurrency,
  formatDate,
  formatInteger,
  formatTime,
} from '@/lib/format';
import { PlayerSummaryCard } from '@/modules/jogadores/components/player-summary-card';
import { useMarketQueries } from '@/modules/mercado/hooks/useMarketQueries';
import type { SaleResult } from '@/modules/mercado/types/market.types';
import type { SquadPlayer } from '../types/clubs.types';
import { PenaltyBadge } from './penalty-badge';

type SellPlayerDialogProps = {
  player: SquadPlayer;
  clubName: string;
  onClose: () => void;
  onSold: (result: SaleResult) => void;
};

export function SellPlayerDialog({
  player,
  clubName,
  onClose,
  onSold,
}: SellPlayerDialogProps) {
  const { contract } = player;

  const rows: ResultRow[] = [
    {
      label: 'Valor de compra',
      value: formatCurrency(contract.purchase_value),
    },
    {
      label: 'Fim da fidelidade',
      value: `${formatDate(contract.loyalty_until)}, ${formatTime(contract.loyalty_until)}`,
    },
    {
      label: 'Dias restantes',
      value: formatInteger(contract.remaining_days),
    },
    {
      label: '% de multa se vender agora',
      value: <PenaltyBadge rate={contract.penalty_rate} />,
    },
  ];

  const { useSellPlayer } = useMarketQueries();
  const { mutate, isPending } = useSellPlayer();

  function handleConfirm() {
    mutate(player.id, { onSuccess: onSold });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 p-8 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Vender {player.name}?</DialogTitle>
          <DialogDescription>
            O jogador sai do elenco do {clubName} e volta a ficar livre.
          </DialogDescription>
        </DialogHeader>

        <PlayerSummaryCard
          player={player}
          aside={
            <div className="text-right">
              <p className="text-sm text-zinc-500">Valor de mercado</p>
              <p className="text-lg font-semibold">
                {formatCurrency(player.market_value)}
              </p>
            </div>
          }
        />

        <ResultList rows={rows} />

        <p className="flex gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
          <Info className="mt-0.5 size-4 shrink-0 text-zinc-500" />A venda é
          pelo valor de mercado do momento. Multa (teto de 10,00), lucro,
          comissão e crédito são calculados ao confirmar.
        </p>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isPending}>
            <Handshake />
            Confirmar venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
