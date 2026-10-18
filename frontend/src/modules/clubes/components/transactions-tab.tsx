import {
  BadgePercent,
  Check,
  Download,
  Handshake,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  User,
  type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { SignedValue } from '@/components/signed-value';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import { PlayerAvatar } from '@/modules/jogadores/components/player-avatar';
import type {
  Transaction,
  TransactionType,
} from '@/modules/mercado/types/market.types';
import { TRANSACTION_TYPE_LABELS } from '../constants/clubs.constants';
import {
  findTransactionsMock,
  TRANSACTION_PLAYERS_MOCK,
} from '../mocks/clubs.mock';

const TYPE_ICONS: Record<TransactionType, LucideIcon> = {
  COMPRA: ShoppingCart,
  VENDA: Handshake,
};

const columns: DataTableColumn<Transaction>[] = [
  {
    id: 'created-at',
    header: 'Data e hora',
    cell: (transaction) => (
      <span>
        {formatDate(transaction.created_at)}{' '}
        <span className="text-zinc-500">
          {formatTime(transaction.created_at)}
        </span>
      </span>
    ),
  },
  {
    id: 'type',
    header: 'Tipo',
    cell: (transaction) => {
      const Icon = TYPE_ICONS[transaction.type];
      return (
        <Badge variant="outline">
          <Icon />
          {TRANSACTION_TYPE_LABELS[transaction.type]}
        </Badge>
      );
    },
  },
  {
    id: 'player',
    header: 'Jogador',
    cell: (transaction) => (
      <span className="flex items-center gap-3">
        <PlayerAvatar
          player={{ id: transaction.player_id, name: transaction.player_name }}
        />
        <span className="font-medium">{transaction.player_name}</span>
      </span>
    ),
  },
  {
    id: 'value',
    header: 'Valor',
    className: 'text-right',
    cell: (transaction) => formatCurrency(transaction.value),
  },
  {
    id: 'fee',
    header: 'Taxa ou comissão',
    className: 'text-right',
    cell: (transaction) => formatCurrency(transaction.fee),
  },
  {
    id: 'penalty',
    header: 'Multa',
    className: 'text-right',
    cell: (transaction) => formatCurrency(transaction.penalty),
  },
  {
    id: 'profit',
    header: 'Lucro',
    className: 'text-right',
    cell: (transaction) =>
      transaction.profit === null ? (
        '–'
      ) : (
        <SignedValue value={transaction.profit} />
      ),
  },
  {
    id: 'cash-change',
    header: 'Variação do caixa',
    className: 'text-right',
    cell: (transaction) => (
      <SignedValue value={transaction.cash_change} className="font-semibold" />
    ),
  },
];

export function TransactionsTab({ clubId }: { clubId: number }) {
  const [{ data, summary }] = useState(() => findTransactionsMock(clubId));
  const [types, setTypes] = useState<string[]>(['COMPRA', 'VENDA']);
  const [playerId, setPlayerId] = useState('all');

  const totals: {
    label: string;
    value: ReactNode;
    hint: string;
    icon: LucideIcon;
  }[] = [
    {
      label: 'Total pago em compras',
      value: formatCurrency(summary.total_spent),
      hint: 'Valor + taxa',
      icon: ShoppingCart,
    },
    {
      label: 'Total recebido em vendas',
      value: formatCurrency(summary.total_received),
      hint: 'Crédito líquido',
      icon: Handshake,
    },
    {
      label: 'Taxas e comissões',
      value: formatCurrency(summary.total_fees),
      hint: 'Somadas',
      icon: BadgePercent,
    },
    {
      label: 'Multas',
      value: formatCurrency(summary.total_penalties),
      hint: 'Por fidelidade',
      icon: TriangleAlert,
    },
    {
      label: 'Lucro total',
      value: <SignedValue value={summary.total_profit} />,
      hint: 'Soma dos lucros, com sinal',
      icon: summary.total_profit < 0 ? TrendingDown : TrendingUp,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold">Histórico de transações</h2>
            <p className="text-sm text-zinc-500">
              Da mais recente para a mais antiga, com o nome e os valores do
              momento de cada operação.
            </p>
          </div>
          <Button type="button" variant="outline">
            <Download />
            Exportar CSV
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-600">Tipo</span>
          <ToggleGroup
            type="multiple"
            variant="outline"
            value={types}
            onValueChange={setTypes}
            className="gap-2"
          >
            {(['COMPRA', 'VENDA'] as const).map((type) => (
              <ToggleGroupItem
                key={type}
                value={type}
                className="gap-2 px-3 data-[state=on]:border-primary data-[state=on]:bg-blue-50 data-[state=on]:text-primary"
              >
                <Check />
                {TRANSACTION_TYPE_LABELS[type]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={playerId} onValueChange={setPlayerId}>
            <SelectTrigger
              aria-label="Filtrar por jogador"
              className="justify-start [&>svg:last-child]:ml-auto"
            >
              <User className="text-zinc-400" />
              <span className="text-zinc-500">Jogador:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">todos</SelectItem>
              {TRANSACTION_PLAYERS_MOCK.map((player) => (
                <SelectItem key={player.id} value={String(player.id)}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={data}
        getRowKey={(transaction) => transaction.id}
        emptyMessage="Nenhuma transação ainda."
      />

      <dl className="grid grid-cols-5 divide-x divide-zinc-200 border-t border-zinc-200 bg-zinc-50">
        {totals.map((total) => (
          <div key={total.label} className="space-y-1 p-4">
            <dt className="flex items-center gap-1.5 text-sm text-zinc-500">
              <total.icon className="size-4" />
              {total.label}
            </dt>
            <dd className="text-lg font-semibold">{total.value}</dd>
            <dd className="text-xs text-zinc-500">{total.hint}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
