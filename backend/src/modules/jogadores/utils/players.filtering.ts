import { normalizeForComparison } from '../../../core/utils/string.utils.js';
import { ListPlayersQueryDto } from '../dtos/list-players-query.dto.js';
import { PlayerWithDynamicValues } from '../interfaces/player.interface.js';

export function filterPlayers(
  players: PlayerWithDynamicValues[],
  query: ListPlayersQueryDto,
): PlayerWithDynamicValues[] {
  return players.filter(
    (player) =>
      (query.search === undefined ||
        normalizeForComparison(player.name).includes(
          normalizeForComparison(query.search),
        )) &&
      (query.position === undefined || player.position === query.position) &&
      (query.condition === undefined || player.condition === query.condition) &&
      (query.free === undefined || (player.clubId === null) === query.free) &&
      (query.club_id === undefined || player.clubId === query.club_id) &&
      player.age >= query.min_age &&
      player.age <= query.max_age &&
      player.marketValue >= query.min_value &&
      player.marketValue <= query.max_value,
  );
}
