import { Eye, Handshake } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  formatDate,
  formatInteger,
  formatTime,
} from '@/lib/format';
import { ConditionBadge } from '@/modules/jogadores/components/condition-badge';
import { PlayerAvatar } from '@/modules/jogadores/components/player-avatar';
import type { SquadPlayer } from '../types/clubs.types';
import { PenaltyBadge } from './penalty-badge';

type SquadTableProps = {
  players: SquadPlayer[];
  onSell: (player: SquadPlayer) => void;
  onShowDetails: (player: SquadPlayer) => void;
};

export function SquadTable({
  players,
  onSell,
  onShowDetails,
}: SquadTableProps) {
  const columns: DataTableColumn<SquadPlayer>[] = [
    {
      id: 'player',
      header: 'Jogador',
      cell: (player) => (
        <span className="flex items-center gap-3">
          <PlayerAvatar player={player} />
          <span className="font-medium">{player.name}</span>
        </span>
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
      id: 'condition',
      header: 'Condição',
      cell: (player) => <ConditionBadge condition={player.condition} />,
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
      id: 'purchase-value',
      header: 'Valor de compra',
      className: 'text-right whitespace-normal',
      cell: (player) => (
        <span className="text-zinc-500">
          {formatCurrency(player.contract.purchase_value)}
        </span>
      ),
    },
    {
      id: 'loyalty-until',
      header: 'Fim da fidelidade',
      className: 'whitespace-normal',
      cell: (player) => (
        <span className="leading-tight">
          <span className="block">
            {formatDate(player.contract.loyalty_until)}
          </span>
          <span className="text-xs text-zinc-500">
            {formatTime(player.contract.loyalty_until)}
          </span>
        </span>
      ),
    },
    {
      id: 'remaining-days',
      header: 'Dias restantes',
      className: 'text-right whitespace-normal',
      cell: (player) => formatInteger(player.contract.remaining_days),
    },
    {
      id: 'penalty-rate',
      header: '% de multa',
      className: 'whitespace-normal',
      cell: (player) => <PenaltyBadge rate={player.contract.penalty_rate} />,
    },
    {
      id: 'actions',
      header: <span className="sr-only">Ações</span>,
      className: 'w-0',
      cell: (player) => (
        <span className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Ver detalhes de ${player.name}`}
            title="Ver detalhes"
            onClick={() => onShowDetails(player)}
          >
            <Eye />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSell(player)}
          >
            <Handshake />
            Vender
          </Button>
        </span>
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="p-4">
        <h2 className="font-semibold">Elenco</h2>
        <p className="text-sm text-zinc-500">
          Ordem por posição (GOL, ZAG, LAT, MEI, ATA), depois pelo nome.
          Contrato calculado para uma venda agora.
        </p>
      </div>
      <DataTable
        columns={columns}
        rows={players}
        getRowKey={(player) => player.id}
        emptyMessage="Nenhum jogador no elenco."
      />
    </section>
  );
}
