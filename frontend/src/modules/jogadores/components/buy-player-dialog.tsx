import { CalendarDays, Clock, Info, Shield, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { FormField } from '@/components/form-field';
import { InputWithIcon } from '@/components/input-with-icon';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/format';
import { CLUBS_MOCK } from '@/modules/clubes/mocks/clubs.mock';
import { PURCHASE_RESULT_MOCK } from '../mocks/players.mock';
import type { Player, PurchaseResult } from '../types/players.types';
import { PlayerSummaryCard } from './player-summary-card';

type BuyPlayerDialogProps = {
  player: Player;
  onClose: () => void;
  onPurchased: (result: PurchaseResult) => void;
};

export function BuyPlayerDialog({
  player,
  onClose,
  onPurchased,
}: BuyPlayerDialogProps) {
  const [clubId, setClubId] = useState('');
  const selectedClub = CLUBS_MOCK.find((club) => String(club.id) === clubId);

  // simulacao
  // Sem validação e sem a API: o resultado é a compra fixa do mockup
  function handleConfirm() {
    onPurchased(PURCHASE_RESULT_MOCK);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-6 p-8 sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Comprar jogador</DialogTitle>
          <DialogDescription>
            Escolha o clube comprador e até quando vai a fidelidade do contrato.
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

        <FormField
          label="Clube comprador"
          htmlFor="buy-club"
          description={`${selectedClub ? `Caixa atual: ${formatCurrency(selectedClub.cash)}. ` : ''}O custo total (valor + taxa) pode ir até 50% do caixa.`}
        >
          <Select value={clubId} onValueChange={setClubId}>
            <SelectTrigger
              id="buy-club"
              // Ícone, texto à esquerda e a seta no canto direito
              className="w-full justify-start [&>svg:last-child]:ml-auto"
            >
              <Shield className="text-zinc-400" />
              <SelectValue placeholder="Escolha o clube" />
            </SelectTrigger>
            <SelectContent>
              {CLUBS_MOCK.map((club) => (
                <SelectItem key={club.id} value={String(club.id)}>
                  {club.name} ({club.acronym}) · caixa{' '}
                  {formatCurrency(club.cash)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Fim da fidelidade"
          htmlFor="buy-loyalty-date"
          description="Depois do momento da compra e até 1.095 dias. Horário de Brasília; enviado com o fuso (-03:00)."
        >
          <div className="grid grid-cols-[1fr_9rem] gap-3">
            <InputWithIcon
              id="buy-loyalty-date"
              type="date"
              icon={CalendarDays}
            />
            <InputWithIcon
              type="time"
              icon={Clock}
              aria-label="Hora do fim da fidelidade"
            />
          </div>
        </FormField>

        <p className="flex gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600">
          <Info className="mt-0.5 size-4 shrink-0 text-zinc-500" />A taxa é de
          5% do valor de mercado, só quando ele passa de 30,00. Taxa, custo e
          novo caixa são calculados ao confirmar.
        </p>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-zinc-200 bg-transparent px-0 pt-5 pb-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm}>
            <ShoppingCart />
            Confirmar compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
