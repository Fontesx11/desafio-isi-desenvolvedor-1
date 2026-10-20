import { cn } from 'cn';
import { Goal } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { PlayerAvatar } from '@/modules/jogadores/components/player-avatar';
import { DUEL_ATTRIBUTE_LABELS } from '../constants/matches.constants';
import type { Duel, DuelPlayer, Match } from '../types/matches.types';
import { ClubAcronymBadge } from './club-acronym-badge';

export function DuelsTable({ match }: { match: Match }) {
  const duels = match.duels ?? [];
  const clubName = (clubId: number) =>
    clubId === match.home.club_id ? match.home.club_name : match.away.club_name;

  const columns: DataTableColumn<Duel>[] = [
    {
      id: 'order',
      header: 'Duelo',
      className: 'w-16',
      cell: (duel) => <Badge variant="secondary">{duel.order}</Badge>,
    },
    {
      id: 'attacker',
      header: 'Atacante',
      cell: (duel) => (
        <PlayerCell
          player={duel.attacker}
          clubName={clubName(duel.attacking_club_id)}
        />
      ),
    },
    {
      id: 'attack',
      header: 'Ataque',
      cell: (duel) => <DuelValue player={duel.attacker} />,
    },
    {
      id: 'defender',
      header: 'Defensor',
      cell: (duel) => (
        <PlayerCell
          player={duel.defender}
          clubName={
            duel.attacking_club_id === match.home.club_id
              ? match.away.club_name
              : match.home.club_name
          }
        />
      ),
    },
    {
      id: 'defense',
      header: 'Defesa',
      cell: (duel) => <DuelValue player={duel.defender} />,
    },
    {
      id: 'goal',
      header: 'Resultado',
      cell: (duel) => (
        <Badge
          variant="outline"
          className={cn(
            duel.goal && 'border-green-200 bg-green-50 text-green-700',
          )}
        >
          {duel.goal && <Goal />}
          {duel.goal ? 'Gol' : 'Sem gol'}
        </Badge>
      ),
    },
  ];

  function groupHeader(duel: Duel, index: number) {
    if (
      index > 0 &&
      duels[index - 1].attacking_club_id === duel.attacking_club_id
    ) {
      return null;
    }
    const isHome = duel.attacking_club_id === match.home.club_id;
    const side = isHome ? match.home : match.away;
    return (
      <span className="flex items-center gap-2 text-sm">
        <ClubAcronymBadge clubId={side.club_id} />
        <span className="font-medium">
          Ataques do {side.club_name} ({isHome ? 'mandante' : 'visitante'})
        </span>
        <span className="ml-auto text-zinc-500">
          {side.goals} {side.goals === 1 ? 'gol' : 'gols'}
        </span>
      </span>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200">
      <div className="p-4">
        <h2 className="font-semibold">Duelos</h2>
        <p className="text-sm text-zinc-500">
          Os 3 ataques do mandante e depois os 3 do visitante, na ordem
          devolvida pela API.
        </p>
      </div>
      <DataTable
        columns={columns}
        rows={duels}
        getRowKey={(duel) => duel.order}
        emptyMessage="Nenhum duelo."
        groupHeader={groupHeader}
      />
    </section>
  );
}

function PlayerCell({
  player,
  clubName,
}: {
  player: DuelPlayer;
  clubName: string;
}) {
  return (
    <span className="flex items-center gap-3">
      <PlayerAvatar
        player={{ id: player.player_id, name: player.player_name }}
      />
      <span className="leading-tight">
        <span className="block font-medium">{player.player_name}</span>
        <span className="text-xs text-zinc-500">
          {player.position} · {clubName}
        </span>
      </span>
    </span>
  );
}

function DuelValue({ player }: { player: DuelPlayer }) {
  return (
    <span>
      <span className="text-zinc-500">
        {DUEL_ATTRIBUTE_LABELS[player.attribute]}
      </span>{' '}
      <span className="font-semibold">{player.value}</span>
    </span>
  );
}
