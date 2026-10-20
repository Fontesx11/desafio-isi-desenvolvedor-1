import { Plus, Swords } from 'lucide-react';
import { getInitials } from '@/modules/jogadores/utils/players.utils';
import { LINEUP_SECTORS } from '../constants/clubs.constants';
import type { LineupSector, SquadPlayer } from '../types/clubs.types';

const ROWS: LineupSector[] = ['attack', 'midfield', 'defense', 'goalkeeper'];

type Marker = {
  index: number;
  sector: LineupSector;
  player: SquadPlayer | undefined;
};

type PitchPreviewProps = {
  slots: LineupSector[];
  squad: SquadPlayer[];
  selectedIds: string[];
};

export function PitchPreview({ slots, squad, selectedIds }: PitchPreviewProps) {
  const markers: Marker[] = slots.map((sector, index) => ({
    index,
    sector,
    player: squad.find((player) => String(player.id) === selectedIds[index]),
  }));

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="p-4">
        <h2 className="font-semibold">Em campo</h2>
        <p className="text-sm text-zinc-500">
          Prévia da escalação, do goleiro ao ataque. As vagas vazias ficam
          tracejadas.
        </p>
      </div>

      <div className="px-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-green-700">
          <PitchLines />
          <div className="absolute inset-0 flex flex-col justify-around py-4">
            {ROWS.map((row) => (
              <div key={row} className="flex justify-around">
                {markers
                  .filter((marker) => marker.sector === row)
                  .map((marker) => (
                    <PitchMarker key={marker.index} marker={marker} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 flex gap-2 border-t border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500">
        <Swords className="size-4 shrink-0" />
        Na partida, atacam os 3 jogadores de linha mais avançados e defendem o
        goleiro e os 2 mais recuados. É gol quando o ataque é maior que a
        defesa.
      </p>
    </section>
  );
}

function PitchLines() {
  return (
    <div aria-hidden className="absolute inset-3 border border-white/40">
      <div className="absolute inset-x-0 top-1/2 border-t border-white/40" />
      <div className="absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-full border border-white/40" />
      <div className="absolute bottom-0 left-1/2 h-1/6 w-1/2 -translate-x-1/2 border border-b-0 border-white/40" />
      <div className="absolute top-0 left-1/2 h-1/6 w-1/2 -translate-x-1/2 border border-t-0 border-white/40" />
    </div>
  );
}

function PitchMarker({ marker }: { marker: Marker }) {
  const { sector, player } = marker;

  return (
    <div className="flex w-20 flex-col items-center gap-1">
      {player ? (
        <div className="relative flex size-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-semibold text-primary-foreground">
          {getInitials(player.name)}
          {player.condition === 'MAL_CONDICIONADO' && (
            <span
              title="Mal condicionado"
              className="absolute -top-1 -left-1 size-3 rounded-full border-2 border-white bg-amber-500"
            />
          )}
        </div>
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-dashed border-white/70 text-white/80">
          <Plus className="size-4" />
        </div>
      )}
      <span className="max-w-full truncate rounded bg-black/40 px-1.5 py-0.5 text-xs text-white">
        {player ? player.name : LINEUP_SECTORS[sector].label}
      </span>
    </div>
  );
}
