import { CircleCheck, History } from 'lucide-react';
import { cn } from 'cn';
import { ResultList, type ResultRow } from '@/components/result-list';
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
import { SignedValue } from '@/components/signed-value';
import {
  formatCurrency,
  formatInteger,
  formatSignedCurrency,
} from '@/lib/format';
import type { SaleResult } from '@/modules/mercado/types/market.types';

const CONTRACT_STATUS_STYLES: Record<SaleResult['contract_status'], string> = {
  RESCINDIDO: 'border-amber-200 bg-amber-50 text-amber-700',
  ENCERRADO: 'border-zinc-200 bg-zinc-50 text-zinc-700',
};

type SaleResultDialogProps = {
  result: SaleResult;
  clubName: string;
  onClose: () => void;
  onShowHistory: () => void;
};

export function SaleResultDialog({
  result,
  clubName,
  onClose,
  onShowHistory,
}: SaleResultDialogProps) {
  const rows: ResultRow[] = [
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
      value: <SignedValue value={result.profit} />,
    },
    {
      label: 'Comissão',
      hint: '10% do lucro até 10,00 + 20% do que passar',
      value: formatCurrency(result.fee),
    },
    {
      label: 'Crédito no caixa',
      hint: 'Valor de venda − multa − comissão',
      value: formatSignedCurrency(result.cash_change),
      highlight: true,
    },
    {
      label: 'Contrato',
      value: (
        <Badge
          variant="outline"
          className={cn(
            'gap-1.5',
            CONTRACT_STATUS_STYLES[result.contract_status],
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {result.contract_status}
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

        <ResultList rows={rows} />

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onShowHistory}>
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
