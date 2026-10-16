import { cn } from 'cn';
import { ArrowUpDown, ChevronDown, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { TablePagination } from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label;

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
      // O título quebra em duas linhas quando a janela é estreita
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
          {player.club_id === null && (
            <Button type="button" variant="outline" size="sm">
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

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="h-9 gap-2">
              <ArrowUpDown />
              Ordenar: {sortLabel?.toLowerCase()}
              <ChevronDown className="text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
              Ordenar por
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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

// Faixas da regra de condição: até 30 soma pontos, de 80 em diante corta
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
