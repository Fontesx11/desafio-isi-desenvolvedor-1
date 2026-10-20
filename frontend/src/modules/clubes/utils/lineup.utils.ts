import type { Player } from '@/modules/jogadores/types/players.types';
import type { Lineup } from '@/modules/liga/types/league.types';
import { FORMATIONS, LINEUP_SECTORS } from '../constants/clubs.constants';
import type { Formation, LineupSector } from '../types/clubs.types';

export function getFormationSlots(formation: Formation | undefined) {
  return FORMATIONS.find((item) => item.value === formation)?.slots ?? [];
}

export function fitsSector(
  player: Pick<Player, 'position'>,
  sector: LineupSector,
) {
  return LINEUP_SECTORS[sector].positions.includes(player.position);
}

export function fillSlots(slots: LineupSector[], players: Player[]) {
  const remaining = [...players];
  return slots.map((sector) => {
    const index = remaining.findIndex((player) => fitsSector(player, sector));
    if (index === -1) {
      return '';
    }
    const [player] = remaining.splice(index, 1);
    return String(player.id);
  });
}

export function toLineupFormValues(lineup: Lineup) {
  if (!lineup.formation) {
    return { player_ids: ['', '', '', '', ''] };
  }
  return {
    formation: lineup.formation,
    player_ids: fillSlots(getFormationSlots(lineup.formation), lineup.players),
  };
}
