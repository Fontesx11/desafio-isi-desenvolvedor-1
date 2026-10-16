import {
  ChartColumn,
  Coins,
  HeartPulse,
  Pencil,
  ShoppingCart,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/format';
import type { Player, PlayerAction } from '../types/players.types';
import { findClub, isFreePlayer } from '../utils/players.utils';
import { AttributeBars } from './attribute-bars';
import { ConditionBadge } from './condition-badge';
import { PlayerAvatar } from './player-avatar';

type PlayerDetailsSheetProps = {
  player: Player;
  onClose: () => void;
  onAction: (action: PlayerAction, player: Player) => void;
};

export function PlayerDetailsSheet({
  player,
  onClose,
  onAction,
}: PlayerDetailsSheetProps) {
  const club = findClub(player.club_id);
  const stats: {
    label: string;
    value: string | number;
    hint: string;
    icon: LucideIcon;
  }[] = [
    {
      label: 'Valor de mercado',
      value: formatCurrency(player.market_value),
      hint: 'Calculado automaticamente',
      icon: Coins,
    },
    {
      label: 'Valor base',
      value: formatCurrency(player.base_value),
      hint: 'Calculado no cadastro',
      icon: Tag,
    },
    {
      label: 'Overall',
      value: player.overall,
      hint: 'Calculado pela posição',
      icon: ChartColumn,
    },
    {
      label: 'Potencial',
      value: player.potential,
      hint: 'Informado no cadastro',
      icon: TrendingUp,
    },
  ];
  const details = [
    { label: 'Idade', value: `${player.age} anos` },
    { label: 'Agilidade', value: player.agility },
    { label: 'Clube', value: club?.name ?? 'Livre' },
  ];

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="gap-0 data-[side=right]:w-[480px] data-[side=right]:sm:max-w-[480px]">
        <SheetHeader className="flex-row items-center gap-3 p-6">
          <PlayerAvatar player={player} className="size-12 text-sm" />
          <div className="space-y-1.5">
            <SheetTitle className="text-xl">{player.name}</SheetTitle>
            <SheetDescription asChild>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{player.position}</Badge>
                <ConditionBadge condition={player.condition} />
                <Badge variant="secondary">{club?.acronym ?? 'Livre'}</Badge>
              </div>
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-200 p-4"
              >
                <p className="flex items-center justify-between text-sm text-zinc-500">
                  {stat.label}
                  <stat.icon className="size-4" />
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.hint}</p>
              </div>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Indicadores técnicos</h3>
              <span className="text-sm text-zinc-500">Escala de 1 a 99</span>
            </div>
            <AttributeBars attributes={player} potential={player.potential} />
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-primary" />
                Valor do atributo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-blue-200" />
                Até o potencial ({player.potential}), que nenhum atributo passa
              </span>
            </p>
          </section>

          <dl className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex justify-between px-4 py-3 text-sm"
              >
                <dt className="text-zinc-500">{detail.label}</dt>
                <dd className="font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-zinc-200 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onAction('edit', player)}
          >
            <Pencil />
            Editar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onAction('condition', player)}
          >
            <HeartPulse />
            Alterar condição
          </Button>
          {isFreePlayer(player) && (
            <Button type="button" className="ml-auto">
              <ShoppingCart />
              Comprar
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
