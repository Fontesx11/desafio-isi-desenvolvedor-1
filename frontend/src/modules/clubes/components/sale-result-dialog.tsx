import { CircleCheck, History } from 'lucide-react';
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
import { formatCurrency, formatInteger } from '@/lib/format';
import type { SaleResult } from '../types/clubs.types';

type SaleResultDialogProps = {
  result: SaleResult;
  clubName: string;
  onClose: () => void;
};

export function SaleResultDialog({
  result,
  clubName,
  onClose,
}: SaleResultDialogProps) {
  const rows = [
    {
      label: 'Valor de compra',
      value: formatCurrency(result.purchase_value),
    },
    {
      label: 'Valor de venda',
      hint: 'Valor de mercado no momento da venda',
      value: formatCurrency(result.value),
    },
    {
      label: 'Dias restantes',
      value: formatInteger(result.remaining_days),
    },
    {
      label: 'Multa',
      hint: 'Pelo percentual dos dias restantes, com teto de 10,00',
      value: formatCurrency(result.penalty),
    },
    {
      label: 'Lucro',
      value: formatCurrency(result.profit),
    },
    {
      label: 'Comissão',
      hint: '10% do lucro até 10,00 + 20% do que passar',
      value: formatCurrency(result.fee),
    },
    {
      label: 'Crédito no caixa',
      hint: 'Valor de venda − multa − comissão',
      value: formatCurrency(result.cash_change),
      highlight: true,
    },
    {
      label: 'Contrato',
      value: <Badge variant="outline">{result.contract_status}</Badge>,
    },
    {
      label: `Novo caixa do ${clubName}`,
      value: formatCurrency(result.club_cash),
      highlight: true,
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-5 overflow-y-auto p-8 sm:max-w-[500px]">
        <DialogHeader className="gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-green-50 text-green-700">
            <CircleCheck className="size-5" />
          </span>
          <DialogTitle className="text-xl">Venda concluída</DialogTitle>
          <DialogDescription>
            {result.player_name} voltou a ficar livre.
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
          {/* simulacao: sem ação até a aba Histórico existir */}
          <Button type="button" variant="outline">
            <History />
            Ver histórico
          </Button>
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
