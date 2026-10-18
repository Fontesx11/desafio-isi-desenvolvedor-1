import { compareNames } from '../../../core/utils/string.utils.js';
import { ClubStandingStats } from '../interfaces/standing.interface.js';

export function sortStandings(standings: ClubStandingStats[]): ClubStandingStats[] {
  return standings.toSorted(
    (left, right) =>
      right.points - left.points ||
      right.goalDifference - left.goalDifference ||
      right.goalsFor - left.goalsFor ||
      compareNames(left.clubName, right.clubName) ||
      left.clubId - right.clubId,
  );
}
