import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { POSITION_LABELS, POSITIONS } from '../constants/players.constants';
import type { PlayerPosition } from '../types/players.types';

type PositionPickerProps = {
  value?: PlayerPosition;
  onChange: (position: PlayerPosition) => void;
  // Com clube, só a posição atual fica habilitada
  lockedTo?: PlayerPosition;
  invalid?: boolean;
};

export function PositionPicker({
  value,
  onChange,
  lockedTo,
  invalid,
}: PositionPickerProps) {
  return (
    <ToggleGroup
      type="single"
      spacing={2}
      value={value ?? ''}
      onValueChange={(next) => next && onChange(next as PlayerPosition)}
      aria-invalid={invalid}
      className="grid w-full grid-cols-5"
    >
      {POSITIONS.map((position) => (
        <ToggleGroupItem
          key={position}
          value={position}
          disabled={lockedTo !== undefined && position !== lockedTo}
          className="h-14 flex-col gap-0.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 data-[state=on]:border-primary data-[state=on]:bg-blue-50 data-[state=on]:text-primary"
        >
          <span className="font-semibold">{position}</span>
          <span className="text-xs font-normal text-zinc-500 group-data-[state=on]/toggle:text-primary">
            {POSITION_LABELS[position]}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
