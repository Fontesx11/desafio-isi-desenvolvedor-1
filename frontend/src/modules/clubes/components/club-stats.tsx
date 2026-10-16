import { Coins, Landmark, Wallet, type LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { ClubDetails } from '../types/clubs.types';

type Stat = {
  label: string;
  value: string;
  unit: string;
  hint: string;
  icon: LucideIcon;
};

export function ClubStats({ club }: { club: ClubDetails }) {
  const stats: Stat[] = [
    {
      label: 'Caixa',
      value: formatCurrency(club.cash),
      unit: 'moedas',
      hint: 'Só muda por compras e vendas',
      icon: Wallet,
    },
    {
      label: 'Valor do elenco',
      value: formatCurrency(club.squad_value),
      unit: 'moedas',
      hint: 'Soma dos valores de mercado',
      icon: Coins,
    },
    {
      label: 'Patrimônio',
      value: formatCurrency(club.net_worth),
      unit: 'moedas',
      hint: 'Caixa + valor do elenco',
      icon: Landmark,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="space-y-1 rounded-xl border border-zinc-200 p-5"
        >
          <p className="flex items-center justify-between text-sm text-zinc-500">
            {stat.label}
            <stat.icon className="size-4" />
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {stat.value}
            <span className="ml-1.5 text-sm font-normal text-zinc-500">
              {stat.unit}
            </span>
          </p>
          <p className="text-xs text-zinc-500">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}
