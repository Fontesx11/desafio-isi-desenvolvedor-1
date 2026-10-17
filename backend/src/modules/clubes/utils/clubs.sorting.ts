import { compareNames } from '../../../core/utils/string.utils.js';
import { ClubSort } from '../enums/clubs.enum.js';
import { ClubWithDynamicValues } from '../interfaces/club.interface.js';

function compareBy(
  option: ClubSort,
  left: ClubWithDynamicValues,
  right: ClubWithDynamicValues,
): number {
  switch (option) {
    case ClubSort.NAME:
      return compareNames(left.name, right.name);
    case ClubSort.NET_WORTH_ASC:
      return left.netWorth - right.netWorth;
    case ClubSort.NET_WORTH_DESC:
      return right.netWorth - left.netWorth;
  }
}

export function sortClubs(
  clubs: ClubWithDynamicValues[],
  sort: ClubSort,
): ClubWithDynamicValues[] {
  return clubs.toSorted(
    (left, right) =>
      compareBy(sort, left, right) ||
      compareNames(left.name, right.name) ||
      left.id - right.id,
  );
}
