import { Link } from '@tanstack/react-router';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { cn } from 'cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import { useClubsQueries } from '@/modules/clubes/hooks/useClubsQueries';
import type { Player, PurchaseResult } from '../types/players.types';

type PurchaseResultDialogProps = {
  player: Player;
  result: PurchaseResult;
  onClose: () => void;
};

export function PurchaseResultDialog({
  player,
  result,
  onClose,
}: PurchaseResultDialogProps) {
  const { useGetClubs } = useClubsQueries();
  const { data: clubs } = useGetClubs();
  const clubName = clubs?.find((club) => club.id === result.club_id)?.name;
  const loyaltyUntil = result.contract.loyalty_until;

  const rows = [
    {
      label: 'Valor',
      hint: 'Valor de mercado no momento da compra',
      value: formatCurrency(result.value),
    },
    {
      label: 'Taxa',
      hint: '5% do valor de mercado quando ele passa de 30,00',
      value: formatCurrency(result.fee),
    },
    {
      label: 'Custo total',
      hint: 'Valor + taxa',
      value: formatCurrency(result.value + result.fee),
      highlight: true,
    },
    {
      label: 'Fim da fidelidade',
      value: `${formatDate(loyaltyUntil)}, ${formatTime(loyaltyUntil)}`,
    },
    {
      label: 'Contrato',
      value: (
        <Badge
          variant="outline"
          className="gap-1.5 border-green-200 bg-green-50 text-green-700"
        >
          <span className="size-1.5 rounded-full bg-current" />
          {result.contract.status}
        </Badge>
      ),
    },
    {
      label: `Novo caixa do ${clubName}`,
      value: formatCurrency(result.club_cash),
      highlight: true,
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 p-8 sm:max-w-[500px]">
        <DialogHeader className="gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-green-50 text-green-700">
            <CircleCheck className="size-5" />
          </span>
          <DialogTitle className="text-xl">Compra concluída</DialogTitle>
          <DialogDescription>
            {player.name} agora é do {clubName}.
          </DialogDescription>
        </DialogHeader>

        <dl className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200">
          {rows.map((row) => (
            <div
              key={row.label}
              className={cn(
                'flex items-center justify-between gap-4 px-4 py-3',
                row.highlight && 'bg-zinc-50',
              )}
            >
              <dt>
                <span className={cn(row.highlight && 'font-semibold')}>
                  {row.label}
                </span>
                {row.hint && (
                  <span className="block text-sm text-zinc-500">
                    {row.hint}
                  </span>
                )}
              </dt>
              <dd
                className={cn(
                  'tabular-nums',
                  row.highlight && 'text-lg font-semibold',
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button asChild variant="outline">
            <Link
              to="/clubs/$clubId"
              params={{ clubId: String(result.club_id) }}
            >
              Ver clube
              <ArrowRight />
            </Link>
          </Button>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
