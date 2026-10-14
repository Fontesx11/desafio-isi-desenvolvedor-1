import { compareNames } from '../../../core/utils/string.utils.js';
import { PlayerWithDynamicValues } from '../dtos/player-response.dto.js';
import { PlayerSort, POSITION_ORDER } from '../enums/players.enum.js';

function compareBy(
  option: PlayerSort,
  left: PlayerWithDynamicValues,
  right: PlayerWithDynamicValues,
): number {
  switch (option) {
    case PlayerSort.NAME:
      return compareNames(left.name, right.name);
    case PlayerSort.VALUE_ASC:
      return left.marketValue - right.marketValue;
    case PlayerSort.VALUE_DESC:
      return right.marketValue - left.marketValue;
    case PlayerSort.AGE_ASC:
      return left.age - right.age;
    case PlayerSort.AGE_DESC:
      return right.age - left.age;
    case PlayerSort.POSITION:
      return POSITION_ORDER[left.position] - POSITION_ORDER[right.position];
  }
}

export function sortPlayers(
  players: PlayerWithDynamicValues[],
  sort: PlayerSort[],
): PlayerWithDynamicValues[] {
  return players.toSorted((left, right) => {
    for (const option of sort) {
      const result = compareBy(option, left, right);
      if (result !== 0) return result;
    }

    return compareNames(left.name, right.name) || left.id - right.id;
  });
}
