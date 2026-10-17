import { cn } from 'cn';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { SortMenu } from '@/components/sort-menu';
import { TablePagination } from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/format';
import {
  PAGE_SIZE,
  POSITION_LABELS,
  SORT_OPTIONS,
} from '../constants/players.constants';
import type { Player, PlayerAction, PlayersTab } from '../types/players.types';
import { ClubCell } from './club-cell';
import { ConditionBadge } from './condition-badge';
import { PlayerAvatar } from './player-avatar';
import { isFreePlayer } from '../utils/players.utils';
import { PlayerRowActions } from './player-row-actions';

const TABS: { value: PlayersTab; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'free', label: 'Livres' },
  { value: 'in-clubs', label: 'Em clubes' },
];

type PlayersTableProps = {
  players: Player[];
  total: number;
  counts: Record<PlayersTab, number>;
  tab: PlayersTab;
  onTabChange: (tab: PlayersTab) => void;
  page: number;
  onPageChange: (page: number) => void;
  onAction: (action: PlayerAction, player: Player) => void;
};

export function PlayersTable({
  players,
  total,
  counts,
  tab,
  onTabChange,
  page,
  onPageChange,
  onAction,
}: PlayersTableProps) {
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  const columns: DataTableColumn<Player>[] = [
    {
      id: 'player',
      header: 'Jogador',
      cell: (player) => (
        <div className="flex items-center gap-3">
          <PlayerAvatar player={player} />
          <div className="leading-tight">
            <p className="font-medium">{player.name}</p>
            <p className="text-xs text-zinc-500">
              {POSITION_LABELS[player.position]}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'position',
      header: 'Posição',
      cell: (player) => <Badge variant="outline">{player.position}</Badge>,
    },
    {
      id: 'overall',
      header: 'Overall',
      className: 'text-right',
      cell: (player) => <span className="font-semibold">{player.overall}</span>,
    },
    {
      id: 'agility',
      header: 'Agilidade',
      cell: (player) => <AgilityBar value={player.agility} />,
    },
    {
      id: 'age',
      header: 'Idade',
      className: 'text-right',
      cell: (player) => player.age,
    },
    {
      id: 'condition',
      header: 'Condição',
      cell: (player) => <ConditionBadge condition={player.condition} />,
    },
    {
      id: 'base-value',
      header: 'Valor base',
      className: 'text-right whitespace-normal',
      cell: (player) => (
        <span className="text-zinc-500">
          {formatCurrency(player.base_value)}
        </span>
      ),
    },
    {
      id: 'market-value',
      header: 'Valor de mercado',
      className: 'text-right whitespace-normal',
      cell: (player) => (
        <span className="font-semibold">
          {formatCurrency(player.market_value)}
        </span>
      ),
    },
    {
      id: 'club',
      header: 'Clube',
      cell: (player) => <ClubCell clubId={player.club_id} />,
    },
    {
      id: 'actions',
      header: <span className="sr-only">Ações</span>,
      className: 'w-0',
      cell: (player) => (
        <div className="flex items-center justify-end gap-2">
          {isFreePlayer(player) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAction('buy', player)}
            >
              <ShoppingCart />
              Comprar
            </Button>
          )}
          <PlayerRowActions player={player} onAction={onAction} />
        </div>
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="flex items-center justify-between gap-4 p-3">
        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as PlayersTab)}
        >
          <TabsList className="h-9">
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="px-3">
                {item.label}
                <span className="text-zinc-500">{counts[item.value]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <SortMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>

      <DataTable
        columns={columns}
        rows={players}
        getRowKey={(player) => player.id}
        emptyMessage="Nenhum jogador encontrado."
      />

      <TablePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        itemLabel={['jogador', 'jogadores']}
        onPageChange={onPageChange}
      />
    </section>
  );
}

function AgilityBar({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-6 text-right tabular-nums">{value}</span>
      <span className="relative h-1.5 w-10 rounded-full bg-zinc-100">
        <span
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-zinc-500',
            value <= 30 && 'bg-red-500',
            value >= 80 && 'bg-green-600',
          )}
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}
