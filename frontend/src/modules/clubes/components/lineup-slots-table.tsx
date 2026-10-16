import { DataTable, type DataTableColumn } from '@/components/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionBadge } from '@/modules/jogadores/components/condition-badge';
import type { LineupSlotMock } from '../mocks/clubs.mock';
import type { SquadPlayer } from '../types/clubs.types';

type Slot = LineupSlotMock & { index: number };

type LineupSlotsTableProps = {
  slots: LineupSlotMock[];
  squad: SquadPlayer[];
  selectedIds: (number | null)[];
  onSelect: (index: number, playerId: number) => void;
};

export function LineupSlotsTable({
  slots,
  squad,
  selectedIds,
  onSelect,
}: LineupSlotsTableProps) {
  const findPlayer = (id: number | null) =>
    squad.find((player) => player.id === id);

  const columns: DataTableColumn<Slot>[] = [
    {
      id: 'slot',
      header: 'Vaga',
      className: 'w-36',
      cell: (slot) => (
        <span className="leading-tight">
          <span className="block font-medium">{slot.label}</span>
          <span className="text-xs text-zinc-500">{slot.positions}</span>
        </span>
      ),
    },
    {
      id: 'player',
      header: 'Titular',
      cell: (slot) => (
        <Select
          value={String(selectedIds[slot.index] ?? '')}
          onValueChange={(value) => onSelect(slot.index, Number(value))}
        >
          <SelectTrigger aria-label={`Titular: ${slot.label}`} className="w-60">
            <SelectValue placeholder="Escolha o titular" />
          </SelectTrigger>
          <SelectContent>
            {squad.map((player) => (
              <SelectItem key={player.id} value={String(player.id)}>
                {player.name} ({player.position})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      id: 'condition',
      header: 'Condição',
      cell: (slot) => {
        const player = findPlayer(selectedIds[slot.index]);
        return player && <ConditionBadge condition={player.condition} />;
      },
    },
    {
      id: 'overall',
      header: 'Overall',
      className: 'text-right',
      cell: (slot) => (
        <span className="font-semibold">
          {findPlayer(selectedIds[slot.index])?.overall}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={slots.map((slot, index) => ({ ...slot, index }))}
      getRowKey={(slot) => slot.index}
      emptyMessage="Nenhuma vaga."
    />
  );
}
