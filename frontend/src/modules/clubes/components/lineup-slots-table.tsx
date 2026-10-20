import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { FormField } from '@/components/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionBadge } from '@/modules/jogadores/components/condition-badge';
import { LINEUP_SECTORS } from '../constants/clubs.constants';
import type { LineupValues } from '../schemas/clubs.schema';
import type { LineupSector, SquadPlayer } from '../types/clubs.types';
import { fitsSector } from '../utils/lineup.utils';

type Slot = { index: number; sector: LineupSector };

type LineupSlotsTableProps = {
  slots: LineupSector[];
  squad: SquadPlayer[];
  selectedIds: string[];
  control: Control<LineupValues>;
  errors: FieldErrors<LineupValues>;
};

export function LineupSlotsTable({
  slots,
  squad,
  selectedIds,
  control,
  errors,
}: LineupSlotsTableProps) {
  const findPlayer = (id: string) =>
    squad.find((player) => String(player.id) === id);

  const columns: DataTableColumn<Slot>[] = [
    {
      id: 'slot',
      header: 'Vaga',
      className: 'w-36',
      cell: ({ sector }) => (
        <span className="leading-tight">
          <span className="block font-medium">
            {LINEUP_SECTORS[sector].label}
          </span>
          <span className="text-xs text-zinc-500">
            {LINEUP_SECTORS[sector].positions.join(' ou ')}
          </span>
        </span>
      ),
    },
    {
      id: 'player',
      header: 'Titular',
      cell: ({ index, sector }) => {
        const options = squad.filter(
          (player) =>
            fitsSector(player, sector) &&
            (selectedIds[index] === String(player.id) ||
              !selectedIds.includes(String(player.id))),
        );
        const error = errors.player_ids?.[index]?.message;

        return (
          <FormField error={error} className="w-60 gap-1.5 py-2">
            <Controller
              control={control}
              name={`player_ids.${index}`}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-label={`Titular: ${LINEUP_SECTORS[sector].label}`}
                    aria-invalid={!!error}
                    className="w-full"
                  >
                    <SelectValue placeholder="Escolha o titular" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {options.map((player) => (
                      <SelectItem
                        key={player.id}
                        value={String(player.id)}
                        disabled={player.condition === 'DOENTE'}
                      >
                        {player.name} ({player.position})
                        {player.condition === 'DOENTE' && ' · Doente'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        );
      },
    },
    {
      id: 'condition',
      header: 'Condição',
      cell: ({ index }) => {
        const player = findPlayer(selectedIds[index]);
        return player && <ConditionBadge condition={player.condition} />;
      },
    },
    {
      id: 'overall',
      header: 'Overall',
      className: 'text-right',
      cell: ({ index }) => (
        <span className="font-semibold">
          {findPlayer(selectedIds[index])?.overall}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={slots.map((sector, index) => ({ index, sector }))}
      getRowKey={(slot) => slot.index}
      emptyMessage="Escolha a formação para ver as vagas."
    />
  );
}
